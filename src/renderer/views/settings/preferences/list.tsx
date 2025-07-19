import { useState, useEffect } from 'react';
import { Heading } from '@components/base/heading';
import { Text } from '@components/base/text';
import { Toggle } from '@protoku/design-system';

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
    <div className="min-h-screen bg-gray-50 dark:bg-[#08090a]">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Heading className="text-2xl font-bold mb-2">Preferences</Heading>
          <Text className="text-gray-600 dark:text-gray-400">
            Customize your Black Citadel experience
          </Text>
        </div>

        <div className="bg-white dark:bg-[#101010] border border-gray-200 dark:border-neutral-800 rounded-lg">
          {/* Appearance Section */}
          <div className="p-6">
            <Heading className="text-lg font-semibold mb-4">Appearance</Heading>
            
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
          </div>
        </div>
      </div>
    </div>
  );
};