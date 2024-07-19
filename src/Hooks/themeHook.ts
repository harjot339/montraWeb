import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { COLORS, DARKCOLORS } from '../Shared/commonStyles';
import { RootState } from '../Store';

const useAppTheme: () => ['dark' | 'light', typeof COLORS] = () => {
  const theme = useSelector((state: RootState) => state?.common.user?.theme);
  const [light, setLight] = useState<boolean>();
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    if (mq.matches) {
      setLight(true);
    }
    mq.addEventListener('change', (evt) => setLight(evt.matches));
  }, []);
  if (theme === 'device' || theme === undefined) {
    if (light) {
      return ['light', COLORS];
    }
    return ['dark', DARKCOLORS];
  }
  const scheme = theme;
  if (scheme === 'light') {
    return ['light', COLORS];
  }
  return ['dark', DARKCOLORS];
};

export default useAppTheme;
