import { createContext } from 'preact';
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'preact/hooks';

interface NavigationContextType {
  currentPage: string;
  navigateTo: (page: string) => void;
}

/**
 * Me: Can I have react router
 * Mom: We already have react-router at home
 * React router at home:
 */
const NavigationContext = createContext<NavigationContextType | null>(null);

const useHashFragment = () => {
  const [hash, setHash] = useState<string>(window.location.hash.slice(1));

  const updateHash = useCallback((newHash: string) => {
    window.location.hash = newHash;
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash.slice(1));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return [hash, updateHash] as const;
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentPage, setCurrentPage] = useHashFragment();

  const contextValue: NavigationContextType = useMemo(
    () => ({
      currentPage: currentPage || 'home',
      navigateTo: setCurrentPage,
    }),
    [currentPage, setCurrentPage],
  );

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation not used inside provider');
  }
  return context;
};
