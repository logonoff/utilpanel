import { FlexContainer, Link, Note, NoteText, P } from '@shalecss/react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
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
  }, [setLog]);

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
      ],
    }),
    [uploadLog],
  );
  useCommandBar('logviewer', actions);

  const getTerminal = () => terminalRef.current?.getTerminal();
  const getFitAddon = () => terminalRef.current?.getFitAddon();
  const getSearchAddon = () => terminalRef.current?.getSearchAddon();

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
  }, [log]);

  const dialogCb = useCallback<DialogProps['cb']>(
    ({ error, log }) => {
      handleResize();
      setError(error);
      setLog(log);
    },
    [handleResize, setError, setLog],
  );

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return (
    <FlexContainer className={styles.container}>
      {error && (
        <Note variant="alert">
          <NoteText>{error}</NoteText>
        </Note>
      )}
      {!log && (
        <P className="empty">
          <Link
            Component="button"
            command="show-modal"
            popovertarget="popover-file-logviewer"
            className={styles.link}
          >
            No log data available. Open a log file in the File menu.
          </Link>
        </P>
      )}
      <div
        className={`${styles.term} ${log ? '' : styles.hidden}`}
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
