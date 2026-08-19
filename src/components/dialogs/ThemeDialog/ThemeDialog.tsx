import { Button, FlexContainer, FlexForm, P, Select } from '@shalecss/react';
import { useEffect, useState } from 'preact/hooks';
import {
  type CommonDialogProps,
  SimpleDialog,
} from '../SimpleDialog/SimpleDialog';

const useUserStorageTheme = () => {
  const [theme, setTheme] = useState<string | undefined>(undefined);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark' | 'contrast'>(
    'light',
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    const contrastQueryList = window.matchMedia('(prefers-contrast: more)');

    const updateSystemTheme = () => {
      if (contrastQueryList.matches) {
        setSystemTheme('contrast');
      } else if (mediaQueryList.matches) {
        setSystemTheme('dark');
      } else {
        setSystemTheme('light');
      }
    };

    updateSystemTheme();

    mediaQueryList.addEventListener('change', updateSystemTheme);
    contrastQueryList.addEventListener('change', updateSystemTheme);

    return () => {
      mediaQueryList.removeEventListener('change', updateSystemTheme);
      contrastQueryList.removeEventListener('change', updateSystemTheme);
    };
  }, []);

  useEffect(() => {
    const computedTheme = theme === 'system' || !theme ? systemTheme : theme;

    document.documentElement.classList.toggle(
      'shale-v1-light',
      computedTheme === 'light',
    );
    document.documentElement.classList.toggle(
      'shale-v1-dark',
      computedTheme === 'dark',
    );
    document.documentElement.classList.toggle(
      'shale-v1-contrast',
      computedTheme === 'contrast',
    );
  }, [theme, systemTheme]);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  const setStorageTheme = (newTheme: string) => {
    setTheme(newTheme);
    if (newTheme === 'system') {
      localStorage.removeItem('theme');
    } else {
      localStorage.setItem('theme', newTheme);
    }
  };

  return [theme, setStorageTheme] as const;
};

export const ThemeDialog: React.FC<CommonDialogProps> = ({ id }) => {
  const [theme, setTheme] = useUserStorageTheme();

  return (
    <SimpleDialog
      id={id}
      title="Theme"
      actions={
        <FlexContainer>
          <Button commandfor={id} command="close">
            OK
          </Button>
          <Button variant="secondary" onClick={() => setTheme('system')}>
            Reset
          </Button>
        </FlexContainer>
      }
    >
      <FlexContainer variant="center">
        <P>Change the theme:</P>
        <FlexForm>
          <Select
            defaultValue={theme || 'system'}
            onChange={(e) => setTheme(e.currentTarget.value)}
          >
            <option value="system">Follow system</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="contrast">High contrast</option>
          </Select>
        </FlexForm>
      </FlexContainer>
    </SimpleDialog>
  );
};
