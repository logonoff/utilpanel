import { Suspense } from 'preact/compat';
import {
  NavigationProvider,
  useNavigation,
} from './contexts/NavigationContext.tsx';
import { pages } from './data/pages.ts';
import { Navigation } from './layout/Navigation.tsx';

import './App.css';

const RenderPage = () => {
  const { currentPage } = useNavigation();

  if (!(currentPage && pages[currentPage])) {
    return <div>Page not found</div>;
  }

  const LazyComponent = pages[currentPage].component;

  return <LazyComponent />;
};

const App = () => (
  <NavigationProvider>
    <Navigation />
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <RenderPage />
      </Suspense>
    </main>
  </NavigationProvider>
);

export default App;
