import { pages } from '../data/pages.ts';

export const preloadPage = (key: string) => {
  const page = pages[key];
  if (page) {
    page.component.preload();
  }
};

export const getOnPreInteractProps = (
  cb: () => void,
): Partial<React.HTMLAttributes<HTMLElement>> => ({
  onMouseEnter: cb,
  onTouchStart: cb,
  onFocus: cb,
});

export const getPreloadPageProps = (
  page: string,
): Partial<React.HTMLAttributes<HTMLElement>> =>
  getOnPreInteractProps(() => preloadPage(page));
