import {
  Button,
  FlexContainer,
  FlexForm,
  Input,
  Note,
  NoteText,
  P,
} from '@shalecss/react';
import { useCallback, useMemo, useState } from 'preact/hooks';
import { Diff } from '../../components/Diff/Diff';
import { PasteTextDialog } from '../../components/dialogs/PasteTextDialog/PasteTextDialog';
import { UrlFetchDialog } from '../../components/dialogs/UrlFetchDialog/UrlFetchDialog';
import {
  type CommandBarActions,
  useCommandBar,
} from '../../contexts/CommandBarContext';
import { openFile } from '../../utils/open-file';
import { saveFile } from '../../utils/save-file';
import { openTextInNewTab } from '../../utils/text-in-new-tab';
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

const DiffViewer: React.FC = () => {
  const [text, setText] = useState<string | null | false>(null);
  const [error, setError] = useState<{ title: string; message: string } | null>(
    null,
  );

  const loadDiffFromUrl = useCallback(
    (urlInput: string) => {
      let url: URL | null = null;

      try {
        url = new URL(translateGitHubPrLinkToApiUrl(urlInput));
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
          setError(
            err instanceof Error
              ? { title: `HTTP Error ${err.cause}!`, message: err.message }
              : { title: 'Error', message: 'Unknown error' },
          );
          setText(null);
        });
    },
    [setText, setError],
  );

  const handleSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const urlInput = form.elements.namedItem('url') as HTMLInputElement;
      loadDiffFromUrl(urlInput.value);
    },
    [loadDiffFromUrl],
  );

  const actions = useMemo<CommandBarActions>(
    () => ({
      File: [
        {
          name: 'Open...',
          callback: () => openFile(setText, '.txt,.diff,.patch'),
        },
        {
          name: 'Upload from URL...',
          command: 'show-modal',
          commandfor: 'upload-diff-dialog',
          ariaHaspopup: 'dialog',
        },
        {
          name: 'Paste diff...',
          command: 'show-modal',
          commandfor: 'paste-diff-dialog',
          ariaHaspopup: 'dialog',
        },
        {
          name: 'Save as...',
          callback: () => {
            if (text) {
              saveFile(text, 'diff.diff');
            }
          },
          disabled: !text,
        },

        {
          name: 'Open in new tab',
          callback: () => {
            if (text) {
              openTextInNewTab(text);
            }
          },
          disabled: !text,
        },
      ],
      Edit: [
        {
          name: 'Clear',
          callback: () => {
            setText(null);
            setError(null);
          },
          disabled: !text && !error,
        },
      ],
    }),
    [text],
  );

  useCommandBar('diffviewer', actions);

  return (
    <FlexContainer>
      <FlexForm onSubmit={handleSubmit} class={styles.form}>
        <Input
          class={styles.input}
          type="url"
          name="url"
          placeholder="Enter link to diff or a GitHub PR link"
          required
        />
        <Button type="submit">Fetch</Button>
      </FlexForm>
      {text === false && <P class="empty">Loading...</P>}
      {error && (
        <Note variant="alert">
          <strong>{error.title}</strong>
          <NoteText>{error.message}</NoteText>
        </Note>
      )}
      {typeof text === 'string' && <Diff text={text} />}
      <UrlFetchDialog
        id="upload-diff-dialog"
        cb={loadDiffFromUrl}
        strings={{
          dialogTitle: 'Upload Diff from URL',
          urlInputLabel: 'Diff URL',
          urlInputPlaceholder: 'Enter link to diff or a GitHub PR link',
          loadButtonText: 'Fetch diff',
        }}
      />
      <PasteTextDialog
        cb={(result) => {
          if (result !== null) {
            setText(result);
            setError(null);
          }
        }}
        strings={{
          dialogTitle: 'Paste Diff',
          textareaPlaceholder: 'Paste your diff here...',
          loadButtonText: 'Load Diff',
        }}
        id="paste-diff-dialog"
      />
    </FlexContainer>
  );
};

export default DiffViewer;
