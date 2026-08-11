import { Link, P } from '@shalecss/react';
import { Suspense } from 'preact/compat';
import { useEffect } from 'preact/hooks';
import { Navigation } from './components/Navigation/Navigation.tsx';
import { useNavigation } from './contexts/NavigationContext.tsx';
import { Providers } from './contexts/Providers.tsx';
import { pages } from './data/pages.ts';

import './App.css';
import { AboutDialog } from './components/AboutDialog/AboutDialog.tsx';
import { ThemeDialog } from './components/ThemeDialog/ThemeDialog.tsx';

const ORIGINAL_TITLE = document.title;

const RenderPage = () => {
  const { currentPage } = useNavigation();

  useEffect(() => {
    if (currentPage && pages[currentPage]) {
      document.title = `${pages[currentPage].name} - ${ORIGINAL_TITLE}`;
    } else {
      document.title = ORIGINAL_TITLE;
    }
  }, [currentPage]);

  if (!(currentPage && pages[currentPage])) {
    return (
      <P className="empty">
        Page not found.&nbsp;<Link href="#">Return home</Link>
      </P>
    );
  }

  const LazyComponent = pages[currentPage].component.Component;

  return <LazyComponent />;
};

const App = () => (
  <Providers>
    <Navigation />
    <main class="main">
      <Suspense fallback={<P className="empty">Loading...</P>}>
        <RenderPage />
      </Suspense>
    </main>
    <AboutDialog />
    <ThemeDialog />
  </Providers>
);

export default App;
