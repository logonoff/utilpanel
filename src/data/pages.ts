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
      () => import(/* webpackPrefetch: true */ '../pages/Home/Home.tsx'),
    ),
  },
  diff: {
    name: 'Diff',
    description: 'Compare two values',
    component: lazy(() => import('../pages/Diff/Diff.tsx')),
  },
};
