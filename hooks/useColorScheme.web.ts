import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);
  const colorScheme = useRNColorScheme(); // Call hook unconditionally
  const [initialColorScheme] = useState(colorScheme || 'light'); // Store initial value

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated ? colorScheme : initialColorScheme;
}

