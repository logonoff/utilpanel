import { Button, CommandBar, Input } from '@shalecss/react';
import { useCallback } from 'preact/hooks';
import { SimpleDialog } from '../../components/SimpleDialog/SimpleDialog.tsx';
import styles from './LogViewer.module.css';

interface UploadLogDialogProps {
  cb: (result: { error: string | null; log: string | null }) => void;
}

export const UploadLogDialog: React.FC<UploadLogDialogProps> = ({ cb }) => {
  const loadLog = useCallback((logUrl: string) => {
    fetch(logUrl)
      .then((response) => response.text())
      .then((text) => cb({ error: null, log: text }))
      .catch((error) => {
        cb({ error: `Error loading log: ${error}`, log: null });
      });
  }, []);

  const onSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    (e) => {
      const formData = new FormData(e.currentTarget);
      const logUrl = formData.get('logUrl') as string;
      loadLog(logUrl);
    },
    [loadLog],
  );

  return (
    <SimpleDialog id="upload-log-dialog" title="Upload Log">
      <form id="logviewer-form" onSubmit={onSubmit} method="dialog">
        <div className={styles.form}>
          <Input
            type="url"
            autofocus
            required
            name="logUrl"
            label="Log URL"
            onPaste={(e) => {
              const pasteAutoSubmit =
                document.querySelector<HTMLInputElement>(
                  '#pasteAutoSubmit',
                )?.checked;
              const clipboardData = e.clipboardData?.getData('text/plain');
              try {
                new URL(clipboardData || '');
                if (pasteAutoSubmit && clipboardData) {
                  loadLog(clipboardData);
                  document
                    .querySelector<HTMLDialogElement>('#upload-log-dialog')
                    ?.close();
                }
              } catch {}
            }}
            id="logUrl"
            className={styles.input}
            placeholder="https://www.com/log.txt"
          />
          <Input
            type="checkbox"
            name="pasteAutoSubmit"
            id="pasteAutoSubmit"
            defaultChecked
            label="Automatically submit on paste"
          />
        </div>
        <CommandBar variant="space-between" gutter>
          <Button type="submit">Load Log</Button>
          <Button
            type="button"
            variant="secondary"
            commandfor="upload-log-dialog"
            command="close"
          >
            Cancel
          </Button>
        </CommandBar>
      </form>
    </SimpleDialog>
  );
};
