import { Button, FlexContainer, H4, P } from '@shalecss/react';
import { useMemo } from 'preact/hooks';
import {
  type CommandBarActions,
  useCommandBar,
} from '../../contexts/CommandBarContext.tsx';
import { useNavigation } from '../../contexts/NavigationContext.tsx';
import { pages } from '../../data/pages.ts';
import { getPreloadPageProps } from '../../utils/preload-page.ts';

import styles from './Home.module.css';

const items = Object.entries(pages).filter(([key]) => key !== 'home');

const Home: React.FC = () => {
  const { navigateTo } = useNavigation();

  const actions = useMemo<CommandBarActions>(() => ({}), []);

  useCommandBar('home', actions);

  return (
    <FlexContainer>
      <H4 Component="h1">
        Random utilities
        <hr class={styles.divider} />
      </H4>
      {items.length === 0 && <P className="empty">This app is empty</P>}
      <FlexContainer className={styles.items}>
        {items.map(([key, page]) => (
          <Button
            className={styles.item}
            variant="secondary"
            key={key}
            href={`#${key}`}
            Component="a"
            onClick={() => navigateTo(key)}
            {...getPreloadPageProps(key)}
          >
            <P>
              <strong>{page.name}</strong>
              <br />
              {page.description}
            </P>
          </Button>
        ))}
      </FlexContainer>
    </FlexContainer>
  );
};

export default Home;
