import { FlexContainer, Note, NoteText, P } from '@shalecss/react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
import { ActionButton } from '../../components/ActionButton/ActionButton.tsx';
import { PasteTextDialog } from './../../components/dialogs/PasteTextDialog/PasteTextDialog.tsx';
import { UrlFetchDialog } from './../../components/dialogs/UrlFetchDialog/UrlFetchDialog.tsx';
import { Xterm } from '../../components/Xterm/Xterm.tsx';
import type { TerminalRef } from '../../components/Xterm/XtermInternal.tsx';
import {
  type CommandBarActions,
  useCommandBar,
} from '../../contexts/CommandBarContext.tsx';
import { debounce } from '../../utils/debounce.ts';
import { openFile } from '../../utils/open-file.ts';
import { FindDialog } from './FindDialog.tsx';

import styles from './LogViewer.module.css';

interface DialogProps {
  cb: (result: { error: string | null; log: string | null }) => void;
}

const LogViewer: React.FC = () => {
  const [log, setLog] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const terminalRef = useRef<TerminalRef>(null);

  const uploadLog = useCallback(() => {
    openFile(setLog);
  }, []);

  const actions = useMemo<CommandBarActions>(
    () => ({
      File: [
        {
          name: 'Open log file...',
          onClick: uploadLog,
        },
        {
          name: 'Upload log from URL...',
          command: 'show-modal',
          commandfor: 'upload-log-dialog',
          ariaHaspopup: 'dialog',
        },
        {
          name: 'Paste log...',
          command: 'show-modal',
          commandfor: 'paste-log-dialog',
          ariaHaspopup: 'dialog',
        },
      ],
      Edit: [
        {
          name: 'Find...',
          command: 'show-modal',
          commandfor: 'find-dialog',
          ariaHaspopup: 'dialog',
        },
        {
          name: 'Clear log',
          onClick: () => {
            setLog(null);
            setError(null);
          },
          disabled: !log && !error,
        },
      ],
    }),
    [uploadLog, log, error],
  );
  useCommandBar('logviewer', actions);

  const getTerminal = useCallback(() => terminalRef.current?.getTerminal(), []);
  const getFitAddon = useCallback(() => terminalRef.current?.getFitAddon(), []);
  const getSearchAddon = useCallback(
    () => terminalRef.current?.getSearchAddon(),
    [],
  );

  const handleResize = useCallback(
    debounce(() => {
      const fitAddon = getFitAddon();
      if (fitAddon) {
        fitAddon.fit();
      }
    }, 100),
    [],
  );

  useEffect(() => {
    handleResize();
    if (log && terminalRef.current) {
      getTerminal()?.reset();
      getTerminal()?.write(log);
      getTerminal()?.write('\x1b[?25l');
    }
  }, [getTerminal, log, handleResize]);

  const dialogCb = useCallback<DialogProps['cb']>(
    ({ error, log }) => {
      handleResize();
      setError(error);
      setLog(log);
    },
    [handleResize],
  );

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return (
    <FlexContainer class={styles.container}>
      {error && (
        <Note variant="alert">
          <NoteText>{error}</NoteText>
        </Note>
      )}
      {!log && (
        <FlexContainer variant="center">
          <P class="empty">No log data available.</P>
          {actions.File.map((action) => (
            <ActionButton key={action.name} {...action} variant="primary" />
          ))}
        </FlexContainer>
      )}
      <div
        class={`${styles.term} ${log ? '' : styles.hidden}`}
        id="log-viewer-terminal-wrapper"
      >
        <Xterm
          ref={terminalRef}
          options={{
            disableStdin: true,
            convertEol: true,
            scrollback: 100000000,
          }}
        />
      </div>
      <UrlFetchDialog
        id="upload-log-dialog"
        cb={(url) => {
          if (url) {
            fetch(url)
              .then((response) => {
                if (!response.ok) {
                  throw new Error(
                    `Failed to fetch log from URL: ${response.status} ${response.statusText}`,
                  );
                }
                return response.text();
              })
              .then((text) => dialogCb({ log: text, error: null }))
              .catch((err) => {
                dialogCb({ log: null, error: err.message });
              });
          }
        }}
        strings={{
          dialogTitle: 'Upload Log from URL',
          urlInputLabel: 'Log URL',
          urlInputPlaceholder: 'Enter the URL of the log file',
          loadButtonText: 'Fetch Log',
        }}
      />
      <PasteTextDialog
        cb={(result) => dialogCb({ log: result, error: '' })}
        strings={{
          dialogTitle: 'Paste Log',
          textareaPlaceholder: 'Paste your log here...',
          loadButtonText: 'Load Log',
        }}
        id="paste-log-dialog"
      />
      <FindDialog getSearchAddon={getSearchAddon} />
    </FlexContainer>
  );
};

export default LogViewer;
