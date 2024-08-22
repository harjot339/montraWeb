const ROUTES = {
  HOMEPAGE: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  ForgotPassword: '/forgot-password',
  Transactions: '/transactions',
  Budgets: '/budgets',
  Report: '/report',
  Terms: '/terms',
  ResetPassword: '/reset-pass',
  VerifyEmail: '/verify-email',
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
  Terms: {
    path: ROUTES.Terms,
    title: 'Terms & Conditions',
  },
  ResetPassword: {
    path: ROUTES.ResetPassword,
    title: 'Reset Password',
  },
  VerifyEmail: {
    path: ROUTES.VerifyEmail,
    title: 'Reset Password',
  },
};

export { ROUTES, WILDCARD_ROUTES, ROUTES_CONFIG };
