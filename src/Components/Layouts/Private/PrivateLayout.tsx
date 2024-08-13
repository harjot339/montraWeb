import React from 'react';
import { useLocation } from 'react-router-dom';
import { AppLayoutProps } from '../AppLayout.d';
import Navbar from './Navbar';
import useInitialSetup from '../../../Hooks/initialSetup';
import useAppTheme from '../../../Hooks/themeHook';

function PrivateLayout({ children }: Readonly<AppLayoutProps>) {
  useInitialSetup();
  const appTheme = useAppTheme();
  const loc = useLocation();
  return loc.pathname === '/terms' || loc.pathname === '/reset-pass' ? (
    <div
      style={{
        backgroundColor: appTheme[1].PRIMARY.LIGHT,
        width: '100vw',
        height: '100%',
        minHeight: '100vh',
      }}
    >
      {children as React.JSX.Element}
    </div>
  ) : (
    <Navbar>{children as React.JSX.Element}</Navbar>
  );
}

export default React.memo(PrivateLayout);
