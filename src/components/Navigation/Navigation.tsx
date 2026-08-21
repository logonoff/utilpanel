import {
  Button,
  CommandBar,
  Header,
  MenuBarButton,
  Nav,
  PopoverContent,
  PopoverToggle,
} from '@shalecss/react';
import type React from 'preact/compat';
import { useCommandBarContext } from '../../contexts/CommandBarContext.tsx';
import { useNavigation } from '../../contexts/NavigationContext.tsx';
import { pages } from '../../data/pages.ts';
import { getPreloadPageProps } from '../../utils/preload-page.ts';
import { ActionButton } from '../ActionButton/ActionButton.tsx';

import styles from './Navigation.module.css';

const HeaderBarButton: React.FC<{ page: string }> = ({ page }) => {
  const { navigateTo } = useNavigation();
  const navigateToPage = () => navigateTo(page);

  return (
    <MenuBarButton
      href={`#${page}`}
      onClick={navigateToPage}
      {...getPreloadPageProps(page)}
    >
      {pages[page]?.name || page}
    </MenuBarButton>
  );
};

/** iframe === windowed mode */
const IS_IN_IFRAME = window.self !== window.top;

const HeaderBar: React.FC = IS_IN_IFRAME
  ? () => null
  : () => {
      const { currentPage, navigateTo } = useNavigation();
      const goHome = () => navigateTo('home');

      return (
        <Nav>
          <div class={styles.breadcrumbs}>
            <MenuBarButton
              onClick={goHome}
              class={styles.logo}
              href="#home"
              tabIndex={-1} // duplicate link so no point having it tabbable
              {...getPreloadPageProps('home')}
            >
              <img src="favicon.ico" alt="Logo" />
            </MenuBarButton>
            <span class={styles.arrow}>▶</span>
            <HeaderBarButton page="home" />
            {currentPage !== 'home' && pages[currentPage] && (
              <>
                <span class={styles.arrow}>▶</span>
                <HeaderBarButton page={currentPage} />
              </>
            )}
          </div>
        </Nav>
      );
    };

export const Navigation: React.FC = () => {
  const { currentPage } = useNavigation();
  const { actions } = useCommandBarContext();

  return (
    <Header>
      <HeaderBar />
      <CommandBar class={styles.commands}>
        {IS_IN_IFRAME && (
          <Button Component="a" href="#home">
            Home
          </Button>
        )}
        {Object.keys(actions).map((group) => {
          if (actions[group].length === 1 && actions[group][0].name === group) {
            const action = actions[group][0];
            return <ActionButton key={action.name} {...action} />;
          }

          const id = `${group.replace(/\s+/g, '-').toLowerCase()}-${currentPage.replace(/\s+/g, '-').toLowerCase()}`;
          return (
            <div key={id} class={styles.submenu}>
              {/* @ts-expect-error - lol i typed it wrong */}
              <PopoverToggle name={id} variant="secondary">
                {group}
              </PopoverToggle>
              <PopoverContent name={id}>
                {actions[group].map((action) => (
                  <li key={action.name}>
                    <ActionButton {...action} />
                  </li>
                ))}
              </PopoverContent>
            </div>
          );
        })}
      </CommandBar>
    </Header>
  );
};
