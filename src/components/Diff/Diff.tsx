import { Code } from '@shalecss/react';

import styles from './Diff.module.css';

interface DiffProps {
  text: string;
}

export const Diff: React.FC<DiffProps> = ({ text }) => (
  <Code Component="pre">
    {text?.split('\n').map((line, index) => (
      <div
        key={index}
        class={
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
);
