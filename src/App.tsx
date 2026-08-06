import { P } from '@shalecss/react';
import { Suspense } from 'preact/compat';
import { useEffect } from 'preact/hooks';
import { Navigation } from './components/Navigation/Navigation.tsx';
import {
  NavigationProvider,
  useNavigation,
} from './contexts/NavigationContext.tsx';
import { pages } from './data/pages.ts';

import './App.css';
import { AboutDialog } from './components/AboutDialog/AboutDialog.tsx';

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
    return <P className="empty">Page not found</P>;
  }

  const LazyComponent = pages[currentPage].component;

  return <LazyComponent />;
};

const App = () => (
  <NavigationProvider>
    <Navigation />
    <main class="main">
      <Suspense fallback={<P className="empty">Loading...</P>}>
        <RenderPage />
      </Suspense>
    </main>
    <AboutDialog />
  </NavigationProvider>
);

export default App;
