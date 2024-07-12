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
      { element: <FilterSection />, index: true },
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
    path: '*',
    element: <Navigate to={WILDCARD_ROUTES.PRIVATE} />,
    title: 'Rendering wildcard',
  },
];
