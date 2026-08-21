import { Button, FlexContainer, H4, P } from '@shalecss/react';
import { useCallback, useMemo } from 'preact/hooks';
import {
  type CommandBarActions,
  useCommandBar,
} from '../../contexts/CommandBarContext.tsx';
import { useNavigation } from '../../contexts/NavigationContext.tsx';
import { pages } from '../../data/pages.ts';
import { getPreloadPageProps } from '../../utils/preload-page.ts';

import styles from './Home.module.css';

const items = Object.entries(pages).filter(([key]) => key !== 'home');

const HomeButton: React.FC<{
  page: (typeof pages)[string];
  pageId: string;
}> = ({ page, pageId }) => {
  const { navigateTo } = useNavigation();

  const goToPage = useCallback(() => {
    navigateTo(pageId);
  }, [navigateTo, pageId]);

  return (
    <Button
      class={styles.item}
      variant="secondary"
      key={pageId}
      href={`#${pageId}`}
      Component="a"
      onClick={goToPage}
      {...getPreloadPageProps(pageId)}
    >
      <P>
        <strong>{page.name}</strong>
        <br />
        {page.description}
      </P>
    </Button>
  );
};

const Home: React.FC = () => {
  const actions = useMemo<CommandBarActions>(() => ({}), []);

  useCommandBar('home', actions);

  return (
    <FlexContainer>
      <H4 Component="h1">
        Random utilities
        <hr class={styles.divider} />
      </H4>
      {items.length === 0 && <P class="empty">This app is empty</P>}
      <FlexContainer class={styles.items}>
        {items.map(([key, page]) => (
          <HomeButton key={key} page={page} pageId={key} />
        ))}
      </FlexContainer>
    </FlexContainer>
  );
};

export default Home;
