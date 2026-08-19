import { FlexForm, Textarea } from '@shalecss/react';
import { useCallback, useMemo } from 'preact/hooks';
import {
  type CommandBarActions,
  useCommandBar,
} from '../../contexts/CommandBarContext';
import { openFile } from '../../utils/open-file';
import { saveFile } from '../../utils/save-file';
import styles from './Base64.module.css';

const decoder = new TextDecoder();
const encoder = new TextEncoder();

const decodeBase64 = (base64: string): string => {
  try {
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    return decoder.decode(bytes);
  } catch {
    return '';
  }
};

const encodeBase64 = (text: string): string => {
  const bytes = encoder.encode(text);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

const Base64: React.FC = () => {
  const syncHeights = useCallback(
    (event: React.ChangeEvent<HTMLFormElement>) => {
      const text = event.currentTarget.elements.namedItem(
        'text',
      ) as HTMLTextAreaElement;
      const base64 = event.currentTarget.elements.namedItem(
        'base64',
      ) as HTMLTextAreaElement;

      // sync heights
      const maxLines = Math.max(
        text.value.split('\n').length,
        base64.value.split('\n').length,
      );
      const lineHeight = parseFloat(
        getComputedStyle(text).lineHeight.replace('px', ''),
      );

      // 8rem is arbitrary height of header+commandbar
      const newHeight = `min(${Math.max(maxLines * lineHeight + 24, 24)}px, calc(100vh - 8rem))`;
      text.style.height = newHeight;
      base64.style.height = newHeight;
    },
    [],
  );

  const onTextChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = event.currentTarget.value;
      const base64Field = event.currentTarget.form?.elements.namedItem(
        'base64',
      ) as HTMLTextAreaElement;
      base64Field.value = encodeBase64(text);
    },
    [],
  );

  const onBase64Change = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const base64 = event.currentTarget.value;
      try {
        const textField = event.currentTarget.form?.elements.namedItem(
          'text',
        ) as HTMLTextAreaElement;
        textField.value = decodeBase64(base64);
      } catch {
        // ignore invalid base64
      }
    },
    [],
  );

  const actions = useMemo<CommandBarActions>(
    () => ({
      File: [
        {
          name: 'Open text...',
          callback: () => {
            openFile((text) => {
              const box = document.querySelector<HTMLTextAreaElement>(
                '#base64-form textarea[name="text"]',
              );
              const form =
                document.querySelector<HTMLFormElement>('#base64-form');
              if (box) {
                box.value = text;
                box.dispatchEvent(new Event('input', { bubbles: true }));
              }
              if (form) {
                form.dispatchEvent(new Event('keydown', { bubbles: true }));
              }
            });
          },
        },
        {
          name: 'Open base64...',
          callback: () => {
            openFile((text) => {
              const box = document.querySelector<HTMLTextAreaElement>(
                '#base64-form textarea[name="base64"]',
              );
              const form =
                document.querySelector<HTMLFormElement>('#base64-form');
              if (box) {
                box.value = text;
                box.dispatchEvent(new Event('input', { bubbles: true }));
              }
              if (form) {
                form.dispatchEvent(new Event('keydown', { bubbles: true }));
              }
            });
          },
        },
        {
          name: 'Save text as...',
          callback: () => {
            saveFile(
              document.querySelector<HTMLTextAreaElement>(
                '#base64-form textarea[name="text"]',
              )?.value ?? '',
              'text.txt',
            );
          },
        },
        {
          name: 'Save base64 as...',
          callback: () => {
            saveFile(
              document.querySelector<HTMLTextAreaElement>(
                '#base64-form textarea[name="base64"]',
              )?.value ?? '',
              'base64.txt',
            );
          },
        },
      ],
      Edit: [
        {
          name: 'Clear',
          callback: () => {
            document.querySelector<HTMLFormElement>('#base64-form')?.reset();
            document
              .querySelectorAll<HTMLTextAreaElement>('#base64-form textarea')
              .forEach((field) => {
                field.style.height = '24px';
              });
          },
        },
      ],
    }),
    [],
  );

  useCommandBar('base64', actions);

  return (
    <FlexForm onKeyDown={syncHeights} class={styles.container} id="base64-form">
      <div class={styles.inputContainer}>
        <Textarea
          name="text"
          placeholder="Enter text to encode"
          onChange={onTextChange}
        />
      </div>
      <div class={styles.outputContainer}>
        <Textarea
          name="base64"
          placeholder="Base64 encoded output"
          onChange={onBase64Change}
        />
      </div>
    </FlexForm>
  );
};

export default Base64;
