import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { COLORS, DARKCOLORS } from '../Shared/commonStyles';
import { RootState } from '../Store';

// const handleDeviceTheme = ({
//   theme,
//   authTheme,
//   deviceScheme,
// }: {
//   theme: 'device' | 'light' | 'dark' | undefined;
//   authTheme: 'device' | 'light' | 'dark' | undefined;
//   deviceScheme: 'device' | 'light' | 'dark';
// }) => {
//   if (theme === undefined && authTheme !== undefined) {
//     if (authTheme === 'light') {
//       return ['light', COLORS];
//     }
//     if (authTheme === 'dark') {
//       return ['dark', DARKCOLORS];
//     }
//   }
//   if (deviceScheme === 'light') {
//     return ['light', COLORS];
//   }
//   return ['dark', DARKCOLORS];
// };
const useAppTheme: () => ['dark' | 'light', typeof COLORS] = () => {
  const theme = useSelector((state: RootState) => state?.common.user?.theme);
  const authTheme = useSelector((state: RootState) => state?.common.theme);
  const [light, setLight] = useState<boolean>();
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    if (mq.matches) {
      setLight(true);
    }
    mq.addEventListener('change', (evt) => setLight(evt.matches));
  }, []);
  if (theme === 'device' || theme === undefined) {
    if (theme === undefined && authTheme !== undefined) {
      if (authTheme === 'light') {
        return ['light', COLORS];
      }
      if (authTheme === 'dark') {
        return ['dark', DARKCOLORS];
      }
    }
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
