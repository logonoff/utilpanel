import {
  Button,
  FlexContainer,
  FlexForm,
  Input,
  Note,
  NoteText,
  P,
  Select,
} from '@shalecss/react';
import { useCallback, useMemo, useState } from 'preact/hooks';
import { Markdown } from '../../components/Markdown/Markdown';
import {
  type NavigationActions,
  useNavigationActions,
} from '../../contexts/NavigationActionContext';

import styles from './GitHubChangelog.module.css';

/** demotes all markdown headings by 1 level */
const demoteMarkdownHeadings = (markdown: string): string => {
  return markdown.replace(/^(#{1,6})\s/gm, (_, hashes) => {
    const newLevel = Math.min(hashes.length + 1, 6);
    return `${'#'.repeat(newLevel)} `;
  });
};

const saveFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const GitHubChangelog: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [markdown, setMarkdown] = useState<false | undefined | string>(
    undefined,
  );

  const onSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      const urlInput = form.elements.namedItem('url') as HTMLInputElement;
      let url: URL | null = null;

      try {
        url = new URL(urlInput.value);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Invalid URL');
        return;
      }

      if (url.hostname !== 'github.com') {
        setError('URL must be from GitHub');
        return;
      }

      const segments = url.pathname.split('/').filter(Boolean);

      if (segments.length < 2) {
        setError('Missing repo and or owner in the URL');
        return;
      }

      setMarkdown(false);

      const [owner, repo] = segments;

      const tokenInput = form.elements.namedItem('token') as HTMLInputElement;

      const lastReleases =
        Number(
          (form.elements.namedItem('fetchLast') as HTMLSelectElement).value,
        ) || 0;

      fetch(
        `https://api.github.com/repos/${owner}/${repo}/releases?per_page=${lastReleases}`,
        {
          headers: tokenInput.value
            ? {
                Authorization: `token ${tokenInput.value}`,
              }
            : {},
        },
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `GitHub API request failed with status ${response.status}`,
            );
          }
          return response.json();
        })
        .then((data) => {
          console.log('Fetched changelog data:', data);
          setMarkdown(
            demoteMarkdownHeadings(
              data
                .map(
                  (release: { name: string; tag_name: string; body: string }) =>
                    `# ${release.name || release.tag_name}\n\n${release.body || ''}`,
                )
                .join('\n\n'),
            ),
          );
          setError(null);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setMarkdown(undefined);
        });
    },
    [],
  );

  const actions = useMemo<NavigationActions>(
    () => ({
      Download: [
        {
          name: 'Download',
          callback: () => {
            if (markdown) {
              saveFile(markdown, 'CHANGELOG.md');
            }
          },
          disabled: !markdown,
        },
      ],
    }),
    [markdown],
  );

  useNavigationActions('ghchangelog', actions);

  return (
    <FlexContainer className={styles.wrapper}>
      <FlexForm className={styles.form} onSubmit={onSubmit}>
        <div class={styles.maininput}>
          <Input
            type="url"
            name="url"
            placeholder="Enter a GitHub URL..."
            className={styles.urlbox}
            required
          />
          <Button type="submit" variant="primary">
            Fetch
          </Button>
          <div className={styles.releases}>
            <Select name="fetchLast" defaultValue="100">
              <option value="5">Last 5 releases</option>
              <option value="10">Last 10 releases</option>
              <option value="25">Last 25 releases</option>
              <option value="100">Last 100 releases</option>
            </Select>
          </div>
        </div>
        <details className={styles.advanced}>
          <summary>More options</summary>
          <Input
            type="password"
            name="token"
            placeholder="Enter your GitHub PAT (optional)"
          />
        </details>
      </FlexForm>
      {error && (
        <Note variant="alert">
          <NoteText>
            {error ? error : 'Enter a GitHub URL to fetch the changelog.'}
          </NoteText>
        </Note>
      )}
      {markdown === false && <P className="empty">Loading changelog...</P>}
      {markdown && (
        <div class={styles.markdown}>
          <Markdown content={markdown} />
        </div>
      )}
    </FlexContainer>
  );
};

export default GitHubChangelog;
