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

const NavigationActionContext = createContext<NavigationActionContextValue>({
  actions: {},
  setActions: () => {},
});

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

  const actions = actionsMap[currentPage] || {};

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
