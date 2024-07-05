import { AppLayoutProps } from '../AppLayout.d';

function PublicLayout({ children }: Readonly<AppLayoutProps>): JSX.Element {
  return (
    <>
      {/* <Navbar /> */}
      {children}
      {/* <Footer /> */}
    </>
  );
}

export default PublicLayout;
