import { Code } from '@shalecss/react';
import { diffWords } from 'diff';
import { useMemo } from 'preact/hooks';

import styles from './Diff.module.css';

interface DiffLine {
  kind: 'text' | 'added' | 'removed' | 'header';
  text: string;
}

interface DiffChange {
  kind: 'change';
  removed: string[];
  added: string[];
}

type DiffGroup = DiffLine | DiffChange;

interface DiffProps {
  text: string;
}

const classifyLines = (lines: string): DiffLine[] =>
  lines.split('\n').map((text) => {
    if (
      text.startsWith('diff ') ||
      text.startsWith('index ') ||
      text.startsWith('--- ') ||
      text.startsWith('+++ ') ||
      text.startsWith('@@')
    ) {
      return { kind: 'header', text };
    }
    if (text.startsWith('+')) return { kind: 'added', text };
    if (text.startsWith('-')) return { kind: 'removed', text };
    return { kind: 'text', text };
  });

const groupLines = (text: string): DiffGroup[] => {
  const lines = classifyLines(text);

  const groups: DiffGroup[] = [];
  let i = 0;

  while (i < lines.length) {
    if (lines[i].kind !== 'removed') {
      groups.push(lines[i]);
      i++;
      continue;
    }

    const removed: string[] = [];
    const added: string[] = [];

    while (i < lines.length && lines[i].kind === 'removed') {
      removed.push(lines[i].text);
      i++;
    }

    while (i < lines.length && lines[i].kind === 'added') {
      added.push(lines[i].text);
      i++;
    }

    groups.push({ kind: 'change', removed, added });
  }

  return groups;
};

const renderWordDiff = (oldText: string, newText: string) => {
  const parts = diffWords(oldText, newText);

  const removedSpans = parts
    .filter((p) => !p.added)
    .map((p, i) => (
      <span key={i} class={p.removed ? styles.removedWord : undefined}>
        {p.value}
      </span>
    ));

  const addedSpans = parts
    .filter((p) => !p.removed)
    .map((p, i) => (
      <span key={i} class={p.added ? styles.addedWord : undefined}>
        {p.value}
      </span>
    ));

  return { removedSpans, addedSpans };
};

const renderChangeGroup = (group: DiffChange, idx: number) => {
  const maxLen = Math.max(group.removed.length, group.added.length);
  const elements: React.ReactNode[] = [];

  for (let j = 0; j < maxLen; j++) {
    const removedLines = group.removed[j];
    const addedLines = group.added[j];
    const wordDiff =
      removedLines != null && addedLines != null
        ? renderWordDiff(removedLines.slice(1), addedLines.slice(1))
        : null;

    if (removedLines != null) {
      elements.push(
        <div key={`${idx}-removed-${j}`} class={styles.removed}>
          {wordDiff ? <>-{wordDiff.removedSpans}</> : removedLines}
        </div>,
      );
    }

    if (addedLines != null) {
      elements.push(
        <div key={`${idx}-added-${j}`} class={styles.added}>
          {wordDiff ? <>+{wordDiff.addedSpans}</> : addedLines}
        </div>,
      );
    }
  }

  return elements;
};

export const Diff: React.FC<DiffProps> = ({ text }) => {
  const diff = useMemo<React.ReactNode[]>(
    () =>
      groupLines(text).map((group, idx) => {
        switch (group.kind) {
          case 'header':
            return (
              <div key={idx} class={styles.header}>
                {group.text}
              </div>
            );

          case 'text':
            return (
              <div key={idx} class={styles.neutral}>
                {group.text}
              </div>
            );

          case 'added':
            return (
              <div key={idx} class={styles.added}>
                {group.text}
              </div>
            );

          case 'change':
            return renderChangeGroup(group, idx);

          default:
            return <div key={idx}>{group.text}</div>;
        }
      }),
    [text],
  );

  return <Code Component="pre">{diff}</Code>;
};
