import { Button, CommandBar, Input } from '@shalecss/react';
import { useCallback } from 'preact/hooks';
import {
  type CommonDialogProps,
  SimpleDialog,
} from '../SimpleDialog/SimpleDialog.tsx';

interface UrlFetchDialogProps extends CommonDialogProps {
  cb: (url: string) => void;
  strings: {
    dialogTitle: string;
    urlInputPlaceholder: string;
    urlInputLabel: string;
    loadButtonText: string;
  };
}

export const UrlFetchDialog: React.FC<UrlFetchDialogProps> = ({
  id,
  cb,
  strings,
}) => {
  const onSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    (e) => {
      const formData = new FormData(e.currentTarget);
      const fetchUrl = formData.get('fetchUrl') as string;
      cb(fetchUrl);
    },
    [cb],
  );

  return (
    <SimpleDialog id={id} title={strings.dialogTitle}>
      <form id={`${id}-form`} onSubmit={onSubmit} method="dialog">
        <div class="dialog-form">
          <Input
            type="url"
            autofocus
            required
            name="fetchUrl"
            label={strings.urlInputLabel}
            onPaste={(e) => {
              const pasteAutoSubmit = document.querySelector<HTMLInputElement>(
                `#${id}-pasteAutoSubmit`,
              )?.checked;
              const clipboardData = e.clipboardData?.getData('text/plain');
              try {
                new URL(clipboardData || '');
                if (pasteAutoSubmit && clipboardData) {
                  cb(clipboardData);
                  document.querySelector<HTMLDialogElement>(`#${id}`)?.close();
                }
              } catch {}
            }}
            id={`${id}-url-input`}
            placeholder={strings.urlInputPlaceholder}
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
