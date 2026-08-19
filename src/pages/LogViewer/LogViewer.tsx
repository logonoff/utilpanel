import { FlexContainer, Link, Note, NoteText, P } from '@shalecss/react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'preact/hooks';
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
import { PasteLogDialog } from './PasteLogDialog.tsx';
import { UploadLogDialog } from './UploadLogDialog.tsx';

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
          name: 'Upload log from file',
          onClick: uploadLog,
        },
        {
          name: 'Upload log from URL',
          command: 'show-modal',
          commandfor: 'upload-log-dialog',
          ariaHaspopup: 'dialog',
        },
        {
          name: 'Paste log',
          command: 'show-modal',
          commandfor: 'paste-log-dialog',
          ariaHaspopup: 'dialog',
        },
      ],
      Edit: [
        {
          name: 'Find',
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
      <UploadLogDialog cb={dialogCb} />
      <PasteLogDialog cb={dialogCb} />
      <FindDialog getSearchAddon={getSearchAddon} />
    </FlexContainer>
  );
};

export default LogViewer;
