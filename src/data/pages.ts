import { lazy } from 'preact/compat';

const lazyPreload = (loader: Parameters<typeof lazy<React.FC<unknown>>>[0]) => {
  const Component = lazy(loader);
  return { Component, preload: loader };
};

interface Page {
  name: string;
  component: ReturnType<typeof lazyPreload>;
  description: string;
}

export const pages: Record<string, Page> = {
  home: {
    name: 'Home',
    description: 'View all utilities',
    component: lazyPreload(
      () => import('../pages/Home/Home.tsx' /* webpackChunkName: "home" */),
    ),
  },
  diffviewer: {
    name: 'Diff Viewer',
    description: 'Colourize a diff file for easier reading',
    component: lazyPreload(
      () =>
        import(
          '../pages/DiffViewer/DiffViewer.tsx' /* webpackChunkName: "diffviewer" */
        ),
    ),
  },
  livediff: {
    name: 'Live Diff',
    description: 'View a live diff of some plain text',
    component: lazyPreload(
      () =>
        import(
          '../pages/LiveDiff/LiveDiff.tsx' /* webpackChunkName: "livediff" */
        ),
    ),
  },
  ghchangelog: {
    name: 'GitHub Changelog Viewer',
    description: 'Nicer frontend for changelogs hosted on GitHub releases',
    component: lazyPreload(
      () =>
        import(
          '../pages/GitHubChangelog/GitHubChangelog.tsx' /* webpackChunkName: "ghchangelog" */
        ),
    ),
  },
  base64: {
    name: 'Base64 Encoder/Decoder',
    description: 'Encode or decode Base64 text',
    component: lazyPreload(
      () =>
        import('../pages/Base64/Base64.tsx' /* webpackChunkName: "base64" */),
    ),
  },
  logviewer: {
    name: 'Log Viewer',
    description: 'View and colourize a log file',
    component: lazyPreload(
      () =>
        import(
          '../pages/LogViewer/LogViewer.tsx' /* webpackChunkName: "logviewer" */
        ),
    ),
  },
};
