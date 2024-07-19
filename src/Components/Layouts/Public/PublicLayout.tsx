import AuthLayout from './AuthLayout';
import { AppLayoutProps } from '../AppLayout.d';

function PublicLayout({ children }: Readonly<AppLayoutProps>): JSX.Element {
  return <AuthLayout>{children as React.JSX.Element}</AuthLayout>;
}

export default PublicLayout;
