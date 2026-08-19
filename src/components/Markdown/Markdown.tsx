import { P } from '@shalecss/react';
import { lazy, Suspense } from 'preact/compat';

export const markdownLoader = () =>
  import('./MarkdownInternal' /* webpackChunkName: "MarkdownInternal" */).then(
    (module) => ({
      default: module.MarkdownInternal,
    }),
  );

const MarkdownWithoutSuspense = lazy(markdownLoader);

export const Markdown: React.FC<{ content: string }> = ({ content }) => (
  <Suspense fallback={<P class="empty">Loading Markdown...</P>}>
    <MarkdownWithoutSuspense content={content} />
  </Suspense>
);
