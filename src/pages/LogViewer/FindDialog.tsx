import { Button, CommandBar, Input } from '@shalecss/react';
import type { ISearchOptions } from '@xterm/addon-search';
import { useCallback } from 'preact/hooks';
import { SimpleDialog } from '../../components/dialogs/SimpleDialog/SimpleDialog.tsx';
import type { TerminalRef } from '../../components/Xterm/XtermInternal.tsx';
import styles from './LogViewer.module.css';

type FindDialogProps = {
  [K in 'getSearchAddon']: () => ReturnType<TerminalRef[K]> | undefined;
};

export const FindDialog: React.FC<FindDialogProps> = ({ getSearchAddon }) => {
  const handleSearch = useCallback(() => {
    const caseSensitive =
      document.querySelector<HTMLInputElement>('#caseSensitive')?.checked;
    const wholeWord =
      document.querySelector<HTMLInputElement>('#wholeWord')?.checked;
    const searchTerm =
      document.querySelector<HTMLInputElement>('#searchTerm')?.value || '';
    const direction = document.querySelector<HTMLInputElement>('#directionUp')
      ?.checked
      ? 'up'
      : 'down';

    const searchAddon = getSearchAddon();

    if (searchAddon) {
      const opts: ISearchOptions = { caseSensitive, wholeWord };

      if (direction === 'up') {
        searchAddon.findPrevious(searchTerm, opts);
      } else {
        searchAddon.findNext(searchTerm, opts);
      }
    }
  }, [getSearchAddon]);

  const onSubmit = useCallback<React.FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault();
      handleSearch();
    },
    [handleSearch],
  );

  return (
    <SimpleDialog id="find-dialog" title="Find">
      <form id="find-form" onSubmit={onSubmit} method="dialog">
        <div class="dialog-form">
          <Input
            type="text"
            name="searchTerm"
            id="searchTerm"
            autofocus={true}
            required={true}
            label="Find what:"
          />
          <div class={styles.findOptions}>
            <form>
              <Input
                type="checkbox"
                name="caseSensitive"
                id="caseSensitive"
                label="Match case"
              />
              <Input
                type="checkbox"
                name="wholeWord"
                id="wholeWord"
                label="Whole word"
              />
            </form>
            <div>
              <label for="direction">Direction</label>
              <Input
                type="radio"
                name="direction"
                id="directionUp"
                label="Up"
              />
              <Input
                type="radio"
                name="direction"
                id="directionDown"
                label="Down"
                defaultChecked={true}
              />
            </div>
          </div>
        </div>
        <CommandBar variant="space-between" gutter={true}>
          <Button type="submit">Find next</Button>
          <Button
            type="button"
            variant="secondary"
            commandfor="find-dialog"
            command="close"
          >
            Cancel
          </Button>
        </CommandBar>
      </form>
    </SimpleDialog>
  );
};
