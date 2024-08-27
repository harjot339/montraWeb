import { Timestamp } from 'firebase/firestore';

export type UserType = {
  name: string;
  email: string;
  uid: string;
  pin: string;
  expenseCategory: string[];
  expenseColors: { [key: string]: string };
  incomeCategory: string[];
  incomeColors: { [key: string]: string };
  budget: {
    [month: string]: {
      [key: string]: {
        alert: boolean;
        limit: number;
        percentage: number;
        conversion: {
          [key: string]: {
            [key: string]: number;
          };
        };
      };
    };
  };
  spend: {
    [month: string]: { [category: string]: { [currency: string]: number } };
  };
  income: {
    [month: string]: { [category: string]: { [currency: string]: number } };
  };
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
  lang?: string;
};
