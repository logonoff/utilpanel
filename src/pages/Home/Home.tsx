import { Button, Container, FlexContainer, H2 } from '@shalecss/react';
import { useNavigation } from '../../contexts/NavigationContext.tsx';
import { pages } from '../../data/pages.ts';

const Home: React.FC = () => {
  const { navigateTo } = useNavigation();

  return (
    <Container Component="main">
      <H2 Component="h1">Random utilities</H2>
      <FlexContainer>
        {Object.entries(pages).map(([key, page]) => (
          <Button variant="secondary" key={key} onClick={() => navigateTo(key)}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <strong>{page.name}</strong>
              {page.description}
            </div>
          </Button>
        ))}
      </FlexContainer>
    </Container>
  );
};

export default Home;
