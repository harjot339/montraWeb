import { useLocation } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import { AppLayoutProps } from '../AppLayout.d';
import useAppTheme from '../../../Hooks/themeHook';

function PublicLayout({ children }: Readonly<AppLayoutProps>): JSX.Element {
  const appTheme = useAppTheme();
  const loc = useLocation();
  return loc.pathname === '/terms' ||
    loc.pathname === '/reset-pass' ||
    loc.pathname === '/verify-email' ? (
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
    <AuthLayout>{children as React.JSX.Element}</AuthLayout>
  );
}

export default PublicLayout;
