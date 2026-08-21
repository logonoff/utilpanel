import type { ButtonProps } from '@shalecss/react';
import type { ButtonHTMLAttributes } from 'preact';
import { createContext } from 'preact';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks';
import { useNavigation } from './NavigationContext';

export interface CommandBarAction
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonProps {
  name: string;
}

export interface CommandBarActions {
  [key: string]: CommandBarAction[];
}

interface CommandBarContextValue {
  actions: CommandBarActions;
  setActions: (page: string, actions: CommandBarActions) => void;
}

/** Controls global command bar items */
const CommandBarContext = createContext<CommandBarContextValue>({
  actions: {},
  setActions: () => {},
});

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

const defaultActions: CommandBarActions = {
  View: [
    {
      name: 'Change theme...',
      command: 'show-modal',
      commandfor: 'theme-dialog',
      'aria-haspopup': 'dialog',
    },
    {
      name: 'Rainbow mode',
      onClick: () => {
        if (rainbowIntervalId) {
          clearInterval(rainbowIntervalId);
          rainbowIntervalId = null;
          document.documentElement.style.removeProperty('--shale-v1-accent');
        } else {
          rainbowIntervalId = setInterval(incrementRainbow, 20);
        }
      },
    },
  ],
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
  defaultActions: CommandBarActions,
  pageActions: CommandBarActions,
): CommandBarActions => {
  const merged: CommandBarActions = { ...pageActions };
  for (const group in defaultActions) {
    if (merged[group]) {
      merged[group] = [...merged[group], ...defaultActions[group]];
    } else {
      merged[group] = defaultActions[group];
    }
  }
  return merged;
};

export const CommandBarProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [actionsMap, setActionsMap] = useState<
    Record<string, CommandBarActions>
  >({});
  const { currentPage } = useNavigation();

  const setActions = useCallback((page: string, actions: CommandBarActions) => {
    setActionsMap(() => ({
      [page]: actions,
    }));
  }, []);

  const actions = useMemo(() => {
    const pageActions = actionsMap[currentPage] || {};
    return mergeActions(defaultActions, pageActions);
  }, [actionsMap, currentPage]);

  const contextValue = useMemo(
    () => ({
      actions,
      setActions,
    }),
    [actions, setActions],
  );

  return (
    <CommandBarContext.Provider value={contextValue}>
      {children}
    </CommandBarContext.Provider>
  );
};

export const useCommandBarContext = () => {
  const context = useContext(CommandBarContext);
  if (!context) {
    throw new Error(
      'useCommandBarContext must be used within a CommandBarProvider',
    );
  }
  return context;
};

export const useCommandBar = (page: string, actions: CommandBarActions) => {
  const { setActions } = useCommandBarContext();

  useEffect(() => {
    setActions(page, actions);
    return () => setActions(page, {});
  }, [page, actions, setActions]);
};
