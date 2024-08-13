import { Navigate } from 'react-router-dom';
import { ROUTES_CONFIG, WILDCARD_ROUTES } from '../Shared/Constants';
import { CustomRouter } from './RootRoutes';
import Home from '../Views/Home';
import TransactionScreen from '../Views/Transactions/TransactionScreen';
import FilterSection from '../Components/FilterSection';
import TransactionDetail from '../Views/TransactionDetail';
import Budgets from '../Views/Budgets';
import BudgetDetail from '../Views/BudgetDetail';
import FinancialReport from '../Views/FinancialReport';
import TermsScreen from '../Views/TermsScreen';
import ResetPassword from '../Views/ResetPassword/ResetPassword';

// eslint-disable-next-line import/prefer-default-export
export const PRIVATE_ROUTES: Array<CustomRouter> = [
  {
    path: ROUTES_CONFIG.HOMEPAGE.path,
    element: <Home />,
    title: ROUTES_CONFIG.HOMEPAGE.title,
  },
  {
    path: ROUTES_CONFIG.Transactions.path,
    element: <TransactionScreen />,
    title: ROUTES_CONFIG.Transactions.title,
    children: [
      { element: <FilterSection setMenu={undefined} />, index: true },
      {
        path: ':id',
        element: <TransactionDetail />,
      },
    ],
  },
  {
    path: ROUTES_CONFIG.Budgets.path,
    element: <Budgets />,
    title: ROUTES_CONFIG.Budgets.title,
    children: [
      {
        path: ':id',
        element: <BudgetDetail />,
      },
    ],
  },
  {
    path: ROUTES_CONFIG.Report.path,
    element: <FinancialReport />,
    title: ROUTES_CONFIG.Report.title,
  },
  {
    path: `${ROUTES_CONFIG.Terms.path}`,
    title: ROUTES_CONFIG.Terms.title,
    element: <TermsScreen />,
  },
  {
    path: `${ROUTES_CONFIG.ResetPassword.path}`,
    title: ROUTES_CONFIG.ResetPassword.title,
    element: <ResetPassword />,
  },
  {
    path: '*',
    element: <Navigate to={WILDCARD_ROUTES.PRIVATE} />,
    title: 'Rendering wildcard',
  },
];
