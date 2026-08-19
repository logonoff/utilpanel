import { Button, CommandBar, Input, Textarea } from '@shalecss/react';
import { useCallback } from 'preact/hooks';
import {
  type CommonDialogProps,
  SimpleDialog,
} from '../SimpleDialog/SimpleDialog.tsx';

interface PasteTextDialogProps extends CommonDialogProps {
  cb: (result: string | null) => void;
  id: string;
  strings: {
    dialogTitle: string;
    textareaPlaceholder: string;
    loadButtonText: string;
  };
}
export const PasteTextDialog: React.FC<PasteTextDialogProps> = ({
  cb,
  id,
  strings,
}) => {
  const loadText = useCallback(() => {
    const textareaText =
      document.querySelector<HTMLTextAreaElement>(`#${id}-textarea`)?.value ||
      '';

    cb(textareaText);
  }, [cb]);

  const loadTextOnPaste = useCallback<
    React.ClipboardEventHandler<HTMLTextAreaElement>
  >((e) => {
    if (
      document.querySelector<HTMLInputElement>(`#${id}-pasteAutoSubmit`)
        ?.checked
    ) {
      cb(e?.clipboardData?.getData('text/plain') || '');
      document.querySelector<HTMLDialogElement>(`#${id}`)?.close();
    }
  }, []);

  return (
    <SimpleDialog id={id} title={strings.dialogTitle}>
      <form id={`${id}-form`} onSubmit={loadText} method="dialog">
        <div class="dialog-form">
          <Textarea
            required
            name="textarea"
            id={`${id}-textarea`}
            autofocus
            placeholder={strings.textareaPlaceholder}
            onPaste={loadTextOnPaste}
          />
          <Input
            type="checkbox"
            name="pasteAutoSubmit"
            id={`${id}-pasteAutoSubmit`}
            defaultChecked
            label="Automatically submit on paste"
          />
        </div>
        <CommandBar variant="space-between" gutter>
          <Button type="submit">{strings.loadButtonText}</Button>
          <Button
            type="button"
            variant="secondary"
            commandfor={id}
            command="close"
          >
            Cancel
          </Button>
        </CommandBar>
      </form>
    </SimpleDialog>
  );
};
