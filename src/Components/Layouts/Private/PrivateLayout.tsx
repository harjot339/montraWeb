import React from 'react';
import { AppLayoutProps } from '../AppLayout.d';
import Navbar from '../Public/Navbar';
import useInitialSetup from '../../../Hooks/initialSetup';

function PrivateLayout({ children }: Readonly<AppLayoutProps>) {
  useInitialSetup();
  return <Navbar>{children as React.JSX.Element}</Navbar>;
}

export default React.memo(PrivateLayout);
