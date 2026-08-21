import { CommandBarProvider } from './CommandBarContext.tsx';
import { NavigationProvider } from './NavigationContext.tsx';

export const Providers = ({ children }: { children: React.ReactNode }) => (
  <NavigationProvider>
    <CommandBarProvider>{children}</CommandBarProvider>
  </NavigationProvider>
);
