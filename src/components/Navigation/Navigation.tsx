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

let hue = 0;
const incrementRainbow = () => {
  hue = (hue + 1) % 360;
  document.documentElement.style.setProperty(
    '--shale-v1-accent',
    `hsl(${hue}, 100%, 50%)`,
    'important',
  );
};

let rainbowIntervalId: number | null = null;

const defaultActions: NavigationActions = {
  Help: [
    {
      name: 'Rainbow mode',
      callback: () => {
        if (rainbowIntervalId) {
          clearInterval(rainbowIntervalId);
          rainbowIntervalId = null;
          document.documentElement.style.removeProperty('--shale-v1-accent');
        } else {
          rainbowIntervalId = setInterval(incrementRainbow, 20);
        }
      },
    },
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
            >
              <img src="favicon.ico" alt="Logo" />
            </MenuBarButton>
            <span class={styles.arrow}>▶</span>
            <MenuBarButton href="#home" onClick={() => navigateTo('home')}>
              Home
            </MenuBarButton>
            {currentPage !== 'home' && pages[currentPage] && (
              <>
                <span class={styles.arrow}>▶</span>
                <MenuBarButton href="#" onClick={() => navigateTo(currentPage)}>
                  {pages[currentPage].name}
                </MenuBarButton>
              </>
            )}
          </div>
        </Nav>
      );
    };

export const Navigation: React.FC = () => {
  const { currentPage } = useNavigation();
  const { actions } = useNavigationActionsContext();

  const mergedActions = useMemo(
    () => mergeActions(defaultActions, actions),
    [actions, currentPage],
  );

  return (
    <Header>
      <HeaderBar />
      <CommandBar className={styles.commands}>
        {IS_IN_IFRAME && (
          <Button Component="a" href="#home">
            Home
          </Button>
        )}
        {Object.keys(mergedActions).map((group) => {
          if (
            mergedActions[group].length === 1 &&
            mergedActions[group][0].name === group
          ) {
            const action = mergedActions[group][0];
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
