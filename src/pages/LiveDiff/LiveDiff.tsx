import { FlexContainer, P, Textarea } from '@shalecss/react';
import { diffLines } from 'diff';
import { type StateUpdater, useMemo, useState } from 'preact/hooks';
import { Diff } from '../../components/Diff/Diff';
import {
  type CommandBarActions,
  useCommandBar,
} from '../../contexts/CommandBarContext';
import { openFile } from '../../utils/open-file';
import { saveFile } from '../../utils/save-file';
import { openTextInNewTab } from '../../utils/text-in-new-tab';
import styles from './LiveDiff.module.css';

const sortAlpha: StateUpdater<string> = (text: string) =>
  text.split('\n').sort().join('\n');

const LiveDiff: React.FC = () => {
  const [before, setBefore] = useState<string>('');
  const [after, setAfter] = useState<string>('');

  const diff = useMemo(() => {
    if (!before || !after) {
      return undefined;
    }

    return diffLines(before, after)
      .map((part) => {
        const prefix = part.added ? '+' : part.removed ? '-' : ' ';
        return part.value
          .replace(/\n$/, '')
          .split('\n')
          .map((line) => `${prefix}${line}`)
          .join('\n');
      })
      .join('\n');
  }, [before, after]);

  const actions = useMemo<CommandBarActions>(
    () => ({
      File: [
        {
          name: 'Open original...',
          onClick: () => openFile(setBefore),
        },
        {
          name: 'Open modified...',
          onClick: () => openFile(setAfter),
        },
        {
          name: 'Save as...',
          onClick: () => {
            if (diff) {
              saveFile(diff, 'diff.txt');
            }
          },
          disabled: !diff,
        },
        {
          name: 'Open in new tab',
          onClick: () => {
            if (diff) {
              openTextInNewTab(diff);
            }
          },
          disabled: !diff,
        },
      ],
      Edit: [
        {
          name: 'Clear',
          onClick: () => {
            setBefore('');
            setAfter('');
          },
          disabled: !diff,
        },
        {
          name: 'Reorder lines A-Z',
          onClick: () => {
            setBefore(sortAlpha);
            setAfter(sortAlpha);
          },
          disabled: !diff,
        },
      ],
    }),
    [diff],
  );

  useCommandBar('livediff', actions);

  return (
    <FlexContainer>
      <div class={styles.input}>
        <div class={styles.before}>
          <Textarea
            placeholder="Original text"
            value={before}
            onChange={(e) => setBefore(e.currentTarget.value)}
          />
        </div>
        <div class={styles.after}>
          <Textarea
            placeholder="Modified text"
            value={after}
            onChange={(e) => setAfter(e.currentTarget.value)}
          />
        </div>
      </div>
      <div class={styles.diff}>
        {typeof diff === 'string' && <Diff text={diff} />}
        {typeof diff === 'undefined' && (
          <P class="empty">Diff will appear here</P>
        )}
      </div>
    </FlexContainer>
  );
};

export default LiveDiff;
