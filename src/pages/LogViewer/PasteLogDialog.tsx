import { Button, CommandBar, Input, Textarea } from '@shalecss/react';
import { useCallback } from 'preact/hooks';
import { SimpleDialog } from '../../components/SimpleDialog/SimpleDialog.tsx';
import styles from './LogViewer.module.css';

interface PasteLogDialogProps {
  cb: (result: { error: string | null; log: string | null }) => void;
}
export const PasteLogDialog: React.FC<PasteLogDialogProps> = ({ cb }) => {
  const loadLog = useCallback(() => {
    const logText =
      document.querySelector<HTMLTextAreaElement>('#logText')?.value || '';

    cb({ error: null, log: logText });
  }, [cb]);

  const loadLogOnPaste = useCallback<
    React.ClipboardEventHandler<HTMLTextAreaElement>
  >((e) => {
    if (document.querySelector<HTMLInputElement>('#pasteAutoSubmit')?.checked) {
      cb({
        error: null,
        log: e?.clipboardData?.getData('text/plain') || '',
      });
      document.querySelector<HTMLDialogElement>('#paste-log-dialog')?.close();
    }
  }, []);

  return (
    <SimpleDialog id="paste-log-dialog" title="Upload Log">
      <form id="logviewer-form" onSubmit={loadLog} method="dialog">
        <div className={styles.form}>
          <Textarea
            required
            name="logText"
            id="logText"
            autofocus
            className={styles.input}
            placeholder="Paste your log here..."
            onPaste={loadLogOnPaste}
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
            commandfor="paste-log-dialog"
            command="close"
          >
            Cancel
          </Button>
        </CommandBar>
      </form>
    </SimpleDialog>
  );
};
