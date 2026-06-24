
import { useEffect, useState } from 'react';

export function useAccentColor() {
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem('celume-accent') ?? 'sky';
  });

  // Apply accent color to DOM whenever it changes
  useEffect(() => {
    document.documentElement.setAttribute('data-accent', accentColor);
    localStorage.setItem('celume-accent', accentColor);
  }, [accentColor]);

  const updateAccentColorInDatabase = async (newColor) => {
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
        body: JSON.stringify({ accentColor: newColor }),
      });

      if (!response.ok) {
        console.error('Failed to update accent color in database:', response.statusText);
      } else {
        const data = await response.json();
        console.log('Accent color updated in database:', data.user.accentColor);
      }
    } catch (error) {
      console.error('Error updating accent color in database:', error);
    }
  };

  const changeAccentColor = async (color) => {
    setAccentColor(color);
    await updateAccentColorInDatabase(color);
  };

  return { accentColor, setAccentColor, changeAccentColor };
}
