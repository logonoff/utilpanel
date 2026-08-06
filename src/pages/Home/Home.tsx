import { Button, FlexContainer, H4 } from '@shalecss/react';
import { useMemo } from 'preact/hooks';
import { useNavigationActions } from '../../contexts/NavigationActionContext.tsx';
import { useNavigation } from '../../contexts/NavigationContext.tsx';
import { pages } from '../../data/pages.ts';

import styles from './Home.module.css';

const Home: React.FC = () => {
  const { navigateTo } = useNavigation();

  const actions = useMemo(() => ({}), []);

  useNavigationActions('home', actions);

  return (
    <FlexContainer Component="main" className={styles.container}>
      <H4 Component="h1">
        Random utilities
        <hr class={styles.divider} />
      </H4>
      <FlexContainer>
        {Object.entries(pages)
          .filter(([key]) => key !== 'home')
          .map(([key, page]) => (
            <Button
              className={styles.item}
              variant="secondary"
              key={key}
              onClick={() => navigateTo(key)}
            >
              <strong>{page.name}</strong>
              {page.description}
            </Button>
          ))}
      </FlexContainer>
    </FlexContainer>
  );
};

export default Home;
