import { Suspense } from 'preact/compat';
import { Navigation } from './components/Navigation/Navigation.tsx';
import { NavigationActionProvider } from './contexts/NavigationActionContext.tsx';
import {
  NavigationProvider,
  useNavigation,
} from './contexts/NavigationContext.tsx';
import { pages } from './data/pages.ts';

import './App.css';
import { AboutDialog } from './components/AboutDialog/AboutDialog.tsx';

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
    <NavigationActionProvider>
      <Navigation />
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <RenderPage />
        </Suspense>
      </main>
    </NavigationActionProvider>
    <AboutDialog />
  </NavigationProvider>
);

export default App;
