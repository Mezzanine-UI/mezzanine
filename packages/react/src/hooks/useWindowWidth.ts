import { useState, useEffect } from 'react';

export function useWindowWidth(): number | undefined {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  function handleResize(): void {
    setWindowWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return (): void => window.removeEventListener('resize', handleResize);
  }, []);

  return windowWidth;
}
