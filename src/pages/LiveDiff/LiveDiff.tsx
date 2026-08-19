import { FlexContainer, P, Textarea } from '@shalecss/react';
import { diffLines } from 'diff';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { Diff } from '../../components/Diff/Diff';
import {
  type CommandBarActions,
  useCommandBar,
} from '../../contexts/CommandBarContext';
import { openFile } from '../../utils/open-file';
import { saveFile } from '../../utils/save-file';
import { openTextInNewTab } from '../../utils/text-in-new-tab';
import styles from './LiveDiff.module.css';

const LiveDiff: React.FC = () => {
  const [before, setBefore] = useState<string>('');
  const [after, setAfter] = useState<string>('');
  const [diff, setDiff] = useState<string | undefined>(undefined);

  const computeDiff = useCallback(() => {
    if (!before || !after) {
      setDiff(undefined);
      return;
    }
    const diffResult = diffLines(before, after);
    const formattedDiff = diffResult
      .map((part) => {
        const prefix = part.added ? '+' : part.removed ? '-' : ' ';
        return part.value
          .replace(/\n$/, '')
          .split('\n')
          .map((line) => `${prefix}${line}`)
          .join('\n');
      })
      .join('\n');
    setDiff(formattedDiff);
  }, [before, after]);

  useEffect(() => {
    computeDiff();
  }, [before, after, computeDiff]);

  const actions = useMemo<CommandBarActions>(
    () => ({
      File: [
        {
          name: 'Open original...',
          callback: () => openFile(setBefore),
        },
        {
          name: 'Open modified...',
          callback: () => openFile(setAfter),
        },
        {
          name: 'Save as...',
          callback: () => {
            if (diff) {
              saveFile(diff, 'diff.txt');
            }
          },
          disabled: !diff,
        },
        {
          name: 'Open in new tab',
          callback: () => {
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
          callback: () => {
            setBefore('');
            setAfter('');
            setDiff(undefined);
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
      <div className={styles.input}>
        <div className={styles.before}>
          <Textarea
            placeholder="Original text"
            value={before}
            onChange={(e) => setBefore(e.currentTarget.value)}
          />
        </div>
        <div className={styles.after}>
          <Textarea
            placeholder="Modified text"
            value={after}
            onChange={(e) => setAfter(e.currentTarget.value)}
          />
        </div>
      </div>
      <div className={styles.diff}>
        {typeof diff === 'string' && <Diff text={diff} />}
        {typeof diff === 'undefined' && (
          <P className="empty">Diff will appear here</P>
        )}
      </div>
    </FlexContainer>
  );
};

export default LiveDiff;
