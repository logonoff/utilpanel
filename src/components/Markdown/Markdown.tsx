import { P } from '@shalecss/react';
import { lazy, Suspense } from 'preact/compat';

const MarkdownWithoutSuspense = lazy(() =>
  import('./MarkdownInternal' /* webpackChunkName: "MarkdownInternal" */).then(
    (module) => ({
      default: module.MarkdownInternal,
    }),
  ),
);

export const Markdown: React.FC<{ content: string }> = ({ content }) => (
  <Suspense fallback={<P className="empty">Loading Markdown...</P>}>
    <MarkdownWithoutSuspense content={content} />
  </Suspense>
);
