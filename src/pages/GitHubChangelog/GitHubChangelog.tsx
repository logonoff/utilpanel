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
import { Markdown, markdownLoader } from '../../components/Markdown/Markdown';
import {
  type CommandBarActions,
  useCommandBar,
} from '../../contexts/CommandBarContext';
import { getOnPreInteractProps } from '../../utils/preload-page';
import { saveFile } from '../../utils/save-file';
import { openTextInNewTab } from '../../utils/text-in-new-tab';
import styles from './GitHubChangelog.module.css';

/** demotes all markdown headings by 1 level */
const demoteMarkdownHeadings = (markdown: string): string => {
  return markdown.replace(/^(#{1,6})\s/gm, (_, hashes) => {
    const newLevel = Math.min(hashes.length + 1, 6);
    return `${'#'.repeat(newLevel)} `;
  });
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
          setMarkdown(
            demoteMarkdownHeadings(
              data
                .map(
                  (release: {
                    name: string;
                    tag_name: string;
                    published_at: string;
                    body: string;
                  }) =>
                    `# [${release.name || release.tag_name}](https://github.com/${owner}/${repo}/releases/tag/${release.tag_name}) - <time datetime="${release.published_at}">${new Date(release.published_at).toLocaleDateString('en-CA')}</time>\n\n${release.body || ''}`,
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

  const actions = useMemo<CommandBarActions>(
    () => ({
      File: [
        {
          name: 'Save as...',
          onClick: () => {
            if (markdown) {
              saveFile(markdown, 'CHANGELOG.md');
            }
          },
          disabled: !markdown,
        },
        {
          name: 'Open in new tab',
          onClick: () => {
            if (markdown) {
              openTextInNewTab(
                markdown,
                'text/markdown;charset=utf-8; variant=GFM',
              );
            }
          },
          disabled: !markdown,
        },
      ],
      Edit: [
        {
          name: 'Clear',
          onClick: () => {
            setMarkdown(undefined);
            setError(null);
            document.querySelectorAll('form input').forEach((input) => {
              (input as HTMLInputElement).value = '';
            });
          },
        },
      ],
    }),
    [markdown],
  );

  useCommandBar('ghchangelog', actions);

  return (
    <FlexContainer class={styles.wrapper}>
      <FlexForm class={styles.form} onSubmit={onSubmit}>
        <div class={styles.maininput}>
          <Input
            type="url"
            name="url"
            placeholder="Enter a GitHub URL..."
            class={styles.urlbox}
            required
          />
          <Button
            type="submit"
            variant="primary"
            {...getOnPreInteractProps(markdownLoader)}
          >
            Fetch
          </Button>
          <div class={styles.releases}>
            <Select name="fetchLast" defaultValue="100">
              <option value="5">Last 5 releases</option>
              <option value="10">Last 10 releases</option>
              <option value="25">Last 25 releases</option>
              <option value="100">Last 100 releases</option>
            </Select>
          </div>
        </div>
        <details class={styles.advanced}>
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
      {markdown === false && <P class="empty">Loading changelog...</P>}
      {markdown && (
        <div class={styles.markdown}>
          <Markdown content={markdown} />
        </div>
      )}
    </FlexContainer>
  );
};

export default GitHubChangelog;
