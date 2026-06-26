import { useEffect, useState } from 'react';

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}');
  } catch {
    return {};
  }
}

export function useStoredUser() {
  const [user, setUser] = useState(() => readStoredUser());

  useEffect(() => {
    const syncUser = () => setUser(readStoredUser());

    syncUser();
    window.addEventListener('storage', syncUser);
    window.addEventListener('userchange', syncUser);

    return () => {
      window.removeEventListener('storage', syncUser);
      window.removeEventListener('userchange', syncUser);
    };
  }, []);

  return user;
}

