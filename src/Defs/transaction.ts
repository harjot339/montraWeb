import { Timestamp } from 'firebase/firestore';

export type TransactionType = {
  id: string;
  amount: number;
  category: string;
  desc: string;
  wallet: string;
  attachement?: string;
  repeat: boolean;
  freq: RepeatDataType | null;
  timeStamp: Timestamp;
  type: 'expense' | 'income' | 'transfer';
  attachementType:
    | 'image'
    | 'pdf'
    | 'doc'
    | 'docx'
    | 'csv'
    | 'xls'
    | 'xlsx'
    | 'txt'
    | 'none';
  from: string;
  to: string;
  conversion: {
    [key: string]: {
      [key: string]: number;
    };
  };
};
export type RepeatDataType = {
  freq: 'yearly' | 'monthly' | 'weekly' | 'daily';
  month?: number;
  day?: number;
  weekDay: number;
  end: 'date' | 'never';
  date?: Date | Timestamp;
};
