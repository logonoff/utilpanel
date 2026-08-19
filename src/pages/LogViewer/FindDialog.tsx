import { Button, CommandBar, Input } from '@shalecss/react';
import type { ISearchOptions } from '@xterm/addon-search';
import { useCallback } from 'preact/hooks';
import { SimpleDialog } from '../../components/SimpleDialog/SimpleDialog.tsx';
import type { TerminalRef } from '../../components/Xterm/XtermInternal.tsx';
import styles from './LogViewer.module.css';

type FindDialogProps = {
  [K in 'getSearchAddon']: () => ReturnType<TerminalRef[K]> | undefined;
};

export const FindDialog: React.FC<FindDialogProps> = ({ getSearchAddon }) => {
  const handleSearch = useCallback(() => {
    const caseSensitive =
      document.querySelector<HTMLInputElement>('#caseSensitive')?.checked ||
      false;
    const wholeWord =
      document.querySelector<HTMLInputElement>('#wholeWord')?.checked || false;
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
  }, []);

  return (
    <SimpleDialog id="find-dialog" title="Find">
      <form
        id="find-form"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        method="dialog"
      >
        <div className={styles.form}>
          <Input
            type="text"
            name="searchTerm"
            id="searchTerm"
            autofocus
            required
            label="Find what:"
          />
          <div className={styles.findOptions}>
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
              <label htmlFor="direction">Direction</label>
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
                defaultChecked
              />
            </div>
          </div>
        </div>
        <CommandBar variant="space-between" gutter>
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
