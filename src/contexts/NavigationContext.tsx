import { createContext } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';

interface NavigationContextType {
  currentPage: string;
  navigateTo: (page: string) => void;
  history: { forwards: string[]; backwards: string[] };
  goBack: () => void;
  goForward: () => void;
}

const NavigationContext = createContext<NavigationContextType | null>(null);

const useHashFragment = () => {
  const [hash, setHash] = useState<string>(window.location.hash.slice(1));

  const updateHash = (newHash: string) => {
    window.location.hash = newHash;
    setHash(newHash);
  };

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
  const [history, setHistory] = useState<{
    forwards: string[];
    backwards: string[];
  }>({
    forwards: [],
    backwards: [],
  });

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    setHistory((prevHistory) => ({
      forwards: [],
      backwards: [...prevHistory.backwards, currentPage],
    }));
  };

  const goBack = () => {
    if (history.backwards.length > 0) {
      const previousPage = history.backwards[history.backwards.length - 1];
      setCurrentPage(previousPage);
      setHistory((prevHistory) => ({
        forwards: [currentPage, ...prevHistory.forwards],
        backwards: prevHistory.backwards.slice(0, -1),
      }));
    }
  };

  const goForward = () => {
    if (history.forwards.length > 0) {
      const nextPage = history.forwards[0];
      setCurrentPage(nextPage);
      setHistory((prevHistory) => ({
        forwards: prevHistory.forwards.slice(1),
        backwards: [...prevHistory.backwards, currentPage],
      }));
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        currentPage: currentPage || 'home',
        navigateTo,
        goBack,
        goForward,
        history,
      }}
    >
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
