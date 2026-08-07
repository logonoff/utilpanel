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

interface NavigationAction extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  callback?: () => void;
}

export interface NavigationActions {
  [key: string]: NavigationAction[];
}

interface NavigationActionContextValue {
  actions: NavigationActions;
  setActions: (page: string, actions: NavigationActions) => void;
}

/** Controls global menu bar items */
const NavigationActionContext = createContext<NavigationActionContextValue>({
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

const defaultActions: NavigationActions = {
  View: [
    {
      name: 'Change theme',
      command: 'show-modal',
      commandfor: 'theme-dialog',
      'aria-haspopup': 'dialog',
    },
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

export const NavigationActionProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [actionsMap, setActionsMap] = useState<
    Record<string, Record<string, NavigationAction[]>>
  >({});
  const { currentPage } = useNavigation();

  const setActions = useCallback(
    (page: string, actions: Record<string, NavigationAction[]>) => {
      setActionsMap((prev) => ({
        ...prev,
        [page]: actions,
      }));
    },
    [],
  );

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
    <NavigationActionContext.Provider value={contextValue}>
      {children}
    </NavigationActionContext.Provider>
  );
};

export const useNavigationActionsContext = () => {
  const context = useContext(NavigationActionContext);
  if (!context) {
    throw new Error(
      'useNavigationActionsContext must be used within a NavigationActionProvider',
    );
  }
  return context;
};

export const useNavigationActions = (
  page: string,
  actions: NavigationActions,
) => {
  const { setActions } = useNavigationActionsContext();

  useEffect(() => {
    setActions(page, actions);
    return () => setActions(page, {});
  }, [page, actions, setActions]);
};
