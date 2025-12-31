import { useEffect, useState } from 'react';

export const useCurrentPathname = () => {
  const [pathname, setPathname] = useState<string | null>(null);

  useEffect(() => {
    const handleChange = () => setPathname(window.location.pathname);

    window.addEventListener('popstate', handleChange);
    return () => window.removeEventListener('popstate', handleChange);
  }, []);

  return pathname;
};
