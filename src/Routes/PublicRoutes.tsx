import { Navigate } from 'react-router-dom';
import { ROUTES_CONFIG, WILDCARD_ROUTES } from '../Shared/Constants';
import { CustomRouter } from './RootRoutes';
import Login from '../Views/Login';
import Signup from '../Views/Signup';
import Forgotpassword from '../Views/ForgotPassword/Forgotpassword';
import TermsScreen from '../Views/TermsScreen';
import ResetPassword from '../Views/ResetPassword/ResetPassword';
import VerifyEmail from '../Views/VerifyEmail';

// eslint-disable-next-line import/prefer-default-export
export const PUBLIC_ROUTES: Array<CustomRouter> = [
  {
    path: `${ROUTES_CONFIG.LOGIN.path}`,
    title: ROUTES_CONFIG.LOGIN.title,
    element: <Login />,
  },
  {
    path: `${ROUTES_CONFIG.SIGNUP.path}`,
    title: ROUTES_CONFIG.SIGNUP.title,
    element: <Signup />,
  },
  {
    path: `${ROUTES_CONFIG.ForgotPassword.path}`,
    title: ROUTES_CONFIG.ForgotPassword.title,
    element: <Forgotpassword />,
  },
  {
    path: `${ROUTES_CONFIG.ResetPassword.path}`,
    title: ROUTES_CONFIG.ResetPassword.title,
    element: <ResetPassword />,
  },
  {
    path: `${ROUTES_CONFIG.Terms.path}`,
    title: ROUTES_CONFIG.Terms.title,
    element: <TermsScreen />,
  },
  {
    path: `${ROUTES_CONFIG.VerifyEmail.path}`,
    title: ROUTES_CONFIG.VerifyEmail.title,
    element: <VerifyEmail />,
  },
  {
    path: '*',
    element: <Navigate to={WILDCARD_ROUTES.PUBLIC} />,
    title: 'Rendering wildcard',
  },
];
