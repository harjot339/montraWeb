import { Navigate } from 'react-router-dom';
import { ROUTES_CONFIG, WILDCARD_ROUTES } from '../Shared/Constants';
import { CustomRouter } from './RootRoutes';
import AuthLayout from '../Views/AuthLayout';

// eslint-disable-next-line import/prefer-default-export
export const PUBLIC_ROUTES: Array<CustomRouter> = [
  {
    path: ROUTES_CONFIG.HOMEPAGE.path,
    element: '<Home />',
    title: ROUTES_CONFIG.HOMEPAGE.title,
  },
  {
    path: `${ROUTES_CONFIG.LOGIN.path}`,
    title: ROUTES_CONFIG.LOGIN.title,
    element: <AuthLayout />,
  },
  {
    path: `${ROUTES_CONFIG.SIGNUP.path}`,
    title: ROUTES_CONFIG.SIGNUP.title,
    element: <AuthLayout />,
  },
  {
    path: `${ROUTES_CONFIG.ForgotPassword.path}`,
    title: ROUTES_CONFIG.ForgotPassword.title,
    element: <AuthLayout />,
  },
  {
    path: '*',
    element: <Navigate to={WILDCARD_ROUTES.PUBLIC} />,
    title: 'Rendering wildcard',
  },
];
