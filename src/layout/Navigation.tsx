import { Button, Nav } from '@shalecss/react';
import type React from 'preact/compat';
import { useNavigation } from '../contexts/NavigationContext.tsx';
import { pages } from '../data/pages.ts';

export const Navigation: React.FC = () => {
  const { goBack, goForward, history, navigateTo, currentPage } =
    useNavigation();

  return (
    <Nav>
      <Button
        disabled={history.backwards.length === 0}
        onClick={() => goBack()}
      >
        Back
      </Button>
      <Button
        disabled={history.forwards.length === 0}
        onClick={() => goForward()}
      >
        Forward
      </Button>
      <Button onClick={() => navigateTo('home')}>Home</Button>
      {currentPage !== 'home' && pages[currentPage] && (
        <Button onClick={() => navigateTo(currentPage)}>
          {pages[currentPage].name}
        </Button>
      )}
    </Nav>
  );
};
