import { P } from '@shalecss/react';
import { forwardRef, lazy, Suspense } from 'preact/compat';
import type { TerminalProps, TerminalRef } from './XtermInternal';

export const xtermLoader = () =>
  import('./XtermInternal' /* webpackChunkName: "XtermInternal" */).then(
    (module) => ({
      default: module.XtermInternal,
    }),
  );

const XtermWithoutSuspense = lazy(xtermLoader);

export const Xterm = forwardRef<TerminalRef, TerminalProps>((props, ref) => (
  <Suspense fallback={<P className="empty">Loading Xterm...</P>}>
    <XtermWithoutSuspense {...props} ref={ref} />
  </Suspense>
));
