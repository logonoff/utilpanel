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
  diff: {
    name: 'Diff',
    description: 'Compare two values',
    component: lazy(
      () => import('../pages/Diff/Diff.tsx' /* webpackChunkName: "diff" */),
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
