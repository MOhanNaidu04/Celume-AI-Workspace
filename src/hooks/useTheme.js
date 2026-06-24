import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage('celume-theme', 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  const updateThemeInDatabase = async (newTheme) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found, skipping database sync');
        return;
      }

      const response = await fetch('http://localhost:4000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ theme: newTheme }),
      });

      if (!response.ok) {
        console.error('Failed to update theme in database:', response.statusText);
      } else {
        const data = await response.json();
        console.log('Theme updated in database:', data.user.theme);
      }
    } catch (error) {
      console.error('Error updating theme in database:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    await updateThemeInDatabase(newTheme);
  };

  return { theme, setTheme, toggleTheme, isDark: theme === 'dark' };
}
