import { lazy } from 'preact/compat';

export const Markdown = lazy(() =>
  import('./MarkdownInternal' /* webpackChunkName: "MarkdownInternal" */).then(
    (module) => ({
      default: module.MarkdownInternal,
    }),
  ),
);
