import { lazy } from 'preact/compat';

interface Page {
  name: string;
  component: ReturnType<typeof lazy<React.FC<unknown>>>;
  description: string;
}

export const pages: Record<string, Page> = {
  home: {
    name: 'Home',
    description: 'View all utilities',
    component: lazy(
      () => import('../pages/Home/Home.tsx' /* webpackChunkName: "home" */),
    ),
  },
  diffviewer: {
    name: 'Diff Viewer',
    description: 'Colourize a diff file for easier reading',
    component: lazy(
      () =>
        import(
          '../pages/DiffViewer/DiffViewer.tsx' /* webpackChunkName: "diffviewer" */
        ),
    ),
  },
  livediff: {
    name: 'Live Diff',
    description: 'View a live diff of a file in a GitHub repository',
    component: lazy(
      () =>
        import(
          '../pages/LiveDiff/LiveDiff.tsx' /* webpackChunkName: "livediff" */
        ),
    ),
  },
  ghchangelog: {
    name: 'GitHub Changelog Viewer',
    description: 'Nicer frontend for changelogs hosted on GitHub releases',
    component: lazy(
      () =>
        import(
          '../pages/GitHubChangelog/GitHubChangelog.tsx' /* webpackChunkName: "ghchangelog" */
        ),
    ),
  },
};
