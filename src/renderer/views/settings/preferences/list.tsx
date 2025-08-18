import { useState, useEffect } from 'react';
import { Text } from '@components/base/text';
import { Toggle } from '@protoku/design-system';
import { ListHeader } from '@components/list-header';
import { Resources } from '@utils/enums';
import { Container } from '@components/base/container';

export const PreferencesListView = (): JSX.Element => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is currently active
    const darkModeActive = document.documentElement.classList.contains('dark');
    setIsDarkMode(darkModeActive);
  }, []);

  const handleThemeToggle = (checked: boolean) => {
    setIsDarkMode(checked);

    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <>
      <ListHeader
        resource={Resources.Preferences}
        showNamespaceDropdown={false}
      />

      <div className='m-2'>
        <Container title="Appearance">
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <Text className="font-medium text-gray-900 dark:text-white">
                  Dark Mode
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  Enable dark theme for a comfortable viewing experience in low light
                </Text>
              </div>
              <Toggle
                checked={isDarkMode}
                onChange={(e) => handleThemeToggle(e.target.checked)}
                label="Toggle dark mode"
              />
            </label>
          </div>
        </Container>
      </div>
    </>
  );
};