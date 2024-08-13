import { useState, useEffect } from 'react';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};
const useIsTablet = () => {
  const [isTablet, setIsTablet] = useState(
    window.innerWidth > 640 && window.innerWidth <= 1024
  );

  useEffect(() => {
    const handleResize = () =>
      setIsTablet(window.innerWidth > 640 && window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isTablet;
};
const useIsDesktop = () => {
  const [isTablet, setIsTablet] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => setIsTablet(window.innerWidth > 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isTablet;
};

export { useIsMobile, useIsTablet, useIsDesktop };
