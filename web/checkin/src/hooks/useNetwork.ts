import { useEffect, useState } from 'react';

export function useNetwork() {
  const [online, setOnline] = useState(window.navigator.onLine);

  useEffect(() => {
    const listener = () => {
      setOnline(window.navigator.onLine);
    };
    window.addEventListener('online', listener);
    window.addEventListener('offline', listener);

    return () => {
      window.removeEventListener('online', listener);
      window.removeEventListener('offline', listener);
    };
  }, []);

  return {
    online,
  };
}
