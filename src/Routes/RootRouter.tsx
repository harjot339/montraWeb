import { useSelector } from 'react-redux';
import { useRoutes } from 'react-router-dom';
import DocumentTitle from './DocumentTitle';
import { authenticatedRoutes, guestRoutes } from './config';
import AppLayout from '../Components/Layouts/AppLayout';
import type { RootState } from '../Store';

function RootRouter() {
  const guest = useRoutes(guestRoutes);
  const authenticated = useRoutes(authenticatedRoutes);
  const uid = useSelector((state: RootState) => state?.common?.user?.uid);
  // console.log('Token', uid);
  const isAuthenticated = !!uid;
  return (
    <>
      <DocumentTitle isAuthenticated={isAuthenticated} />
      <AppLayout isAuthenticated={isAuthenticated}>
        {uid ? authenticated : guest}
      </AppLayout>
    </>
  );
}

export default RootRouter;
