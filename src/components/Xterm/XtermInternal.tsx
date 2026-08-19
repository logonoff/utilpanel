import { FitAddon } from '@xterm/addon-fit';
import { SearchAddon } from '@xterm/addon-search';
import { WebLinksAddon } from '@xterm/addon-web-links';
import type { ITerminalOptions } from '@xterm/xterm';
import { Terminal } from '@xterm/xterm';
import { forwardRef } from 'preact/compat';
import { useImperativeHandle, useRef } from 'preact/hooks';

import '@xterm/xterm/css/xterm.css';

export interface TerminalProps {
  options?: Partial<ITerminalOptions>;
}

export interface TerminalRef {
  getTerminal: () => Terminal;
  getFitAddon: () => FitAddon;
  getWebLinksAddon: () => WebLinksAddon;
  getSearchAddon: () => SearchAddon;
}

const createXterm = (props: TerminalProps) => {
  const term = new Terminal({ ...props.options });
  const fitAddon = new FitAddon();
  const webLinksAddon = new WebLinksAddon();
  const searchAddon = new SearchAddon();

  term.loadAddon(fitAddon);
  term.loadAddon(webLinksAddon);
  term.loadAddon(searchAddon);
  return { term, fitAddon, webLinksAddon, searchAddon };
};

export const XtermInternal = forwardRef<TerminalRef, TerminalProps>(
  (props: TerminalProps, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    const terminalRef = useRef<ReturnType<typeof createXterm> | null>(null);

    if (!terminalRef.current) {
      terminalRef.current = createXterm(props);
    }

    const term = terminalRef.current;

    const handleContainerRef = (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (node) {
        term.term.open(node);
        term.fitAddon.fit();
      }
    };

    useImperativeHandle(ref, () => ({
      getTerminal: () => term.term,
      getFitAddon: () => term.fitAddon,
      getWebLinksAddon: () => term.webLinksAddon,
      getSearchAddon: () => term.searchAddon,
    }));

    return (
      <div ref={handleContainerRef} style={{ width: '100%', height: '100%' }} />
    );
  },
);
