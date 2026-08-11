import {
  Button,
  Card,
  CommandBar,
  Header,
  MenuBarButton,
  Nav,
} from '@shalecss/react';
import type React from 'preact/compat';
import { useCommandBarContext } from '../../contexts/CommandBarContext.tsx';
import { useNavigation } from '../../contexts/NavigationContext.tsx';
import { pages } from '../../data/pages.ts';
import { getPreloadPageProps } from '../../utils/preload-page.ts';

import styles from './Navigation.module.css';

const HeaderBarButton: React.FC<{ page: string }> = ({ page }) => {
  const { navigateTo } = useNavigation();

  return (
    <MenuBarButton
      href={`#${page}`}
      onClick={() => navigateTo(page)}
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

      return (
        <Nav>
          <div class={styles.breadcrumbs}>
            <MenuBarButton
              onClick={() => navigateTo('home')}
              className={styles.logo}
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
      <CommandBar className={styles.commands}>
        {IS_IN_IFRAME && (
          <Button Component="a" href="#home">
            Home
          </Button>
        )}
        {Object.keys(actions).map((group) => {
          if (actions[group].length === 1 && actions[group][0].name === group) {
            const action = actions[group][0];
            return (
              <Button
                key={group}
                onClick={action.callback}
                {...action}
                variant="secondary"
              >
                {action.name}
              </Button>
            );
          }

          const id = `${group.replace(/\s+/g, '-').toLowerCase()}-${currentPage.replace(/\s+/g, '-').toLowerCase()}`;
          const popoverId = `popover-${id}`;
          const buttonId = `button-${id}`;
          return (
            <div
              key={id}
              class={styles.submenu}
              style={{ '--anchor-name': `--anchor-${id}` }}
            >
              <Button
                id={buttonId}
                popovertarget={popoverId}
                variant="secondary"
              >
                {group}
              </Button>
              <Card Component="menu" popover id={popoverId}>
                {actions[group].map((action) => (
                  <li key={action.name}>
                    <Button
                      variant="secondary"
                      onClick={action.callback}
                      {...action}
                    >
                      {action.name}
                    </Button>
                  </li>
                ))}
              </Card>
            </div>
          );
        })}
      </CommandBar>
    </Header>
  );
};
