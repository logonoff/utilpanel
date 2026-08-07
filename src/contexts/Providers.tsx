import { CommandBarProvider } from './CommandBarContext';
import { NavigationProvider } from './NavigationContext';

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <NavigationProvider>
    <CommandBarProvider>{children}</CommandBarProvider>
  </NavigationProvider>
);
