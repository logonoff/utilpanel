import {
  Button,
  Code,
  FlexContainer,
  FlexForm,
  Input,
  Note,
  NoteText,
  P,
} from '@shalecss/react';
import { useCallback, useMemo, useState } from 'preact/hooks';
import {
  type CommandBarActions,
  useCommandBar,
} from '../../contexts/CommandBarContext';
import { saveFile } from '../../utils/save-file';
import styles from './DiffViewer.module.css';

const translateGitHubPrLinkToApiUrl = (url: string): string => {
  try {
    const parsedUrl = new URL(url);
    if (parsedUrl.hostname !== 'github.com') {
      return url;
    }

    const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);
    if (pathSegments.length < 4 || pathSegments[2] !== 'pull') {
      return url;
    }

    const [owner, repo, , pullNumber] = pathSegments;
    return `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`;
  } catch {
    return url;
  }
};

const Diff: React.FC = () => {
  const [text, setText] = useState<string | null | false>(null);
  const [error, setError] = useState<{ title: string; message: string } | null>(
    null,
  );

  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const urlInput = form.elements.namedItem('url') as HTMLInputElement;

      let url: URL | null = null;

      try {
        url = new URL(translateGitHubPrLinkToApiUrl(urlInput.value));
      } catch (e) {
        alert(e instanceof Error ? e.message : 'Invalid URL');
        return;
      }

      fetch(url.toString(), {
        headers: {
          Accept: 'application/vnd.github.v3.diff',
        },
      })
        .then(async (response) => {
          if (!response.ok) {
            const body = await response.text();
            throw new Error(body, { cause: response.status });
          }
          return response.text();
        })
        .then((data) => {
          setText(data);
          setError(null);
        })
        .catch((err) => {
          console.error('Error fetching diff:', err);
          setError(
            err instanceof Error
              ? { title: `HTTP Error ${err.cause}!`, message: err.message }
              : { title: 'Error', message: 'Unknown error' },
          );
          setText(null);
        });
    },
    [],
  );

  const actions = useMemo<CommandBarActions>(
    () => ({
      File: [
        {
          name: 'Open',
          callback: () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.diff,.patch';
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                  setText(reader.result as string);
                  setError(null);
                };
                reader.onerror = () => {
                  setError({
                    title: 'File Read Error',
                    message: 'Failed to read the file.',
                  });
                };
                reader.readAsText(file);
              }
            };
            input.click();
          },
        },
        {
          name: 'Download',
          callback: () => {
            if (text) {
              saveFile(text, 'diff.diff');
            }
          },
          disabled: !text,
        },
      ],
      View: [
        {
          name: 'Clear diff',
          callback: () => {
            setText(null);
            setError(null);
          },
          disabled: !text && !error,
        },
        {
          name: 'Open in new tab',
          callback: () => {
            if (text) {
              const blob = new Blob([text], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              window.open(url, '_blank');
            }
          },
          disabled: !text,
        },
      ],
    }),
    [text],
  );

  useCommandBar('diffviewer', actions);

  return (
    <FlexContainer>
      <FlexForm onSubmit={handleSubmit} className={styles.form}>
        <Input
          className={styles.input}
          type="url"
          name="url"
          placeholder="Enter link to diff or a GitHub PR link"
          required
        />
        <Button type="submit">Fetch</Button>
      </FlexForm>
      {text === false && <P className="empty">Loading...</P>}
      {error && (
        <Note variant="alert">
          <strong>{error.title}</strong>
          <NoteText>{error.message}</NoteText>
        </Note>
      )}
      {typeof text === 'string' && (
        <Code Component="pre">
          {text?.split('\n').map((line, index) => (
            <div
              key={index}
              className={
                line.startsWith('+')
                  ? styles.added
                  : line.startsWith('-')
                    ? styles.removed
                    : styles.neutral
              }
            >
              {line}
            </div>
          ))}
        </Code>
      )}
    </FlexContainer>
  );
};

export default Diff;
