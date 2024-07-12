const ROUTES = {
  HOMEPAGE: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  ForgotPassword: '/forgot-password',
  Transactions: '/transactions',
  Budgets: '/budgets',
  Report: '/report',
  // ABOUT: '/about-us',
};

const WILDCARD_ROUTES = {
  PUBLIC: ROUTES.LOGIN,
  PRIVATE: ROUTES.HOMEPAGE,
};

const ROUTES_CONFIG = {
  HOMEPAGE: {
    path: ROUTES.HOMEPAGE,
    title: 'Home',
  },
  LOGIN: {
    path: ROUTES.LOGIN,
    title: 'Login',
  },
  SIGNUP: {
    path: ROUTES.SIGNUP,
    title: 'Signup',
  },
  ForgotPassword: {
    path: ROUTES.ForgotPassword,
    title: 'Forgot Password',
  },
  Transactions: {
    path: ROUTES.Transactions,
    title: 'Transactions',
  },
  Budgets: {
    path: ROUTES.Budgets,
    title: 'Budgets',
  },
  Report: {
    path: ROUTES.Report,
    title: 'Financial Report',
  },
};

export { ROUTES, WILDCARD_ROUTES, ROUTES_CONFIG };
