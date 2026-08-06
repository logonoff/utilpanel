import {
  Button,
  Card,
  CommandBar,
  Header,
  MenuBarButton,
  Nav,
} from '@shalecss/react';
import type React from 'preact/compat';
import { useMemo } from 'preact/compat';
import {
  type NavigationActions,
  useNavigationActionsContext,
} from '../../contexts/NavigationActionContext.tsx';
import { useNavigation } from '../../contexts/NavigationContext.tsx';
import { pages } from '../../data/pages.ts';

import styles from './Navigation.module.css';

const defaultActions: NavigationActions = {
  Help: [
    {
      name: 'About',
      command: 'show-modal',
      commandfor: 'about-dialog',
      'aria-haspopup': 'dialog',
    },
  ],
};

const mergeActions = (
  defaultActions: NavigationActions,
  pageActions: NavigationActions,
): NavigationActions => {
  const merged: NavigationActions = { ...pageActions };
  for (const group in defaultActions) {
    if (merged[group]) {
      merged[group] = [...defaultActions[group], ...merged[group]];
    } else {
      merged[group] = defaultActions[group];
    }
  }
  return merged;
};

export const Navigation: React.FC = () => {
  const { currentPage, navigateTo } = useNavigation();
  const { actions } = useNavigationActionsContext();

  const mergedActions = useMemo(
    () => mergeActions(defaultActions, actions),
    [actions, currentPage],
  );

  return (
    <Header>
      <Nav>
        <div class={styles.breadcrumbs}>
          <MenuBarButton onClick={() => navigateTo('home')}>
            <img src="favicon.ico" alt="Logo" class={styles.logo} />
          </MenuBarButton>
          <span class={styles.arrow}>▶</span>
          <MenuBarButton href="#home" onClick={() => navigateTo('home')}>
            Home
          </MenuBarButton>
          {currentPage !== 'home' && (
            <>
              <span class={styles.arrow}>▶</span>
              <MenuBarButton href="#" onClick={() => navigateTo(currentPage)}>
                {pages[currentPage].name}
              </MenuBarButton>
            </>
          )}
        </div>
      </Nav>
      <CommandBar className={styles.commands}>
        {Object.keys(mergedActions).map((group) => {
          const id = `${group.replace(/\s+/g, '-').toLowerCase()}-${currentPage.replace(/\s+/g, '-').toLowerCase()}`;
          const popoverId = `popover-${id}`;
          const buttonId = `button-${id}`;
          return (
            <div key={id} class={styles.submenu}>
              <Button
                id={buttonId}
                popovertarget={popoverId}
                variant="secondary"
              >
                {group}
              </Button>
              <Card Component="menu" popover id={popoverId}>
                {mergedActions[group].map((action) => (
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
