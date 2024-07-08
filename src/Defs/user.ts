import { Timestamp } from 'firebase/firestore';

export type UserType = {
  name: string;
  email: string;
  uid: string;
  pin: string;
  expenseCategory: string[];
  incomeCategory: string[];
  budget: {
    [month: string]: {
      [key: string]: { alert: boolean; limit: number; percentage: number };
    };
  };
  spend: { [month: string]: { [key: string]: number } };
  income: { [month: string]: { [key: string]: number } };
  notification: {
    [id: string]: {
      category: string;
      type: string;
      id: string;
      time: Timestamp;
      read: boolean;
      percentage: number;
    };
  };
  currency: string;
  theme: 'device' | 'light' | 'dark';
  isSocial: boolean;
};
