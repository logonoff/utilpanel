import { pages } from '../data/pages.ts';

export const preloadPage = (key: string) => {
  const page = pages[key];
  if (page) {
    page.component.preload();
  }
};

export const getPreloadPageProps = (
  page: string,
): Partial<React.HTMLAttributes<HTMLElement>> => ({
  onMouseEnter: () => preloadPage(page),
  onTouchStart: () => preloadPage(page),
  onFocus: () => preloadPage(page),
});
