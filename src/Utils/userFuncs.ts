import { DocumentData, Timestamp } from 'firebase/firestore';
import { UserType } from '../Defs/user';
import { decrypt, encrypt } from './encryption';
import {
  initialExpenseCategories,
  initialIncomeCategories,
} from '../Shared/Strings';

const decryptNotifications = (json: DocumentData) => {
  return (
    Object.fromEntries(
      Object.entries<{
        category: string;
        type: string;
        id: string;
        time: Timestamp;
        read: boolean;
        percentage: number;
      }>(json.notification ?? {}).map(([key, val]) => {
        return [
          key,
          {
            category: decrypt(val.category, json.uid) ?? val.category,
            type: decrypt(val.type, json.uid) ?? val.type,
            id: val.id,
            time: val.time,
            read: val.read,
            percentage: val.percentage ?? 0,
          },
        ];
      })
    ) ?? {}
  );
};
const decryptIncome = (json: DocumentData) => {
  return (
    Object.fromEntries(
      Object.entries<{ [key: string]: string }>(json?.income ?? {}).map(
        ([key, value]) => {
          return [
            key,
            Object.assign(
              {},
              ...Object.entries(value ?? {}).map(([subkey, subval]) => {
                return {
                  [subkey]: Number(decrypt(subval, json.uid)),
                };
              })
            ),
          ];
        }
      )
    ) ?? {}
  );
};
const decryptExpense = (json: DocumentData) => {
  return (
    Object.fromEntries(
      Object.entries<{ [key: string]: string }>(json?.spend ?? {}).map(
        ([key, value]) => {
          return [
            key,
            Object.assign(
              {},
              ...Object.entries(value ?? {}).map(([subkey, subval]) => {
                return {
                  [subkey]: Number(decrypt(subval, json.uid)),
                };
              })
            ),
          ];
        }
      )
    ) ?? {}
  );
};
const decryptBudget = (json: DocumentData) => {
  return (
    Object.fromEntries(
      Object.entries<{
        [key: string]: { alert: boolean; limit: string; percentage: string };
      }>(json?.budget ?? {}).map(([key, value]) => {
        return [
          key,
          Object.assign(
            {},
            ...Object.entries(value ?? {}).map(([subKey, subValue]) => {
              return {
                [subKey]: {
                  alert: subValue.alert,
                  limit: Number(decrypt(subValue.limit, json.uid)),
                  percentage: Number(decrypt(subValue.percentage, json.uid)),
                },
              };
            })
          ),
        ];
      })
    ) ?? {}
  );
};
export function UserToJson({
  uid,
  name,
  email,
  isSocial,
}: {
  uid: string;
  name: string;
  email: string;
  isSocial: boolean;
}): UserType {
  return {
    uid,
    name: encrypt(name, uid),
    email: encrypt(email, uid),
    pin: '',
    expenseCategory: initialExpenseCategories.map((item) => encrypt(item, uid)),
    incomeCategory: initialIncomeCategories.map((item) => encrypt(item, uid)),
    budget: {},
    spend: {},
    income: {},
    notification: {},
    currency: encrypt('USD', uid),
    theme: encrypt('device', uid) as 'device' | 'light' | 'dark',
    isSocial,
  };
}
export function UserFromJson(json: DocumentData): UserType {
  return {
    uid: json.uid,
    email: decrypt(json.email, json.uid) ?? json.email,
    name: decrypt(json.name, json.uid) ?? json.name,
    pin: json.pin !== '' ? decrypt(json.pin, json.uid) ?? json.pin : '',
    expenseCategory:
      json?.expenseCategory?.map((item: string) => decrypt(item, json.uid)) ??
      initialExpenseCategories,
    incomeCategory:
      json?.incomeCategory?.map((item: string) => decrypt(item, json.uid)) ??
      initialIncomeCategories,
    budget: decryptBudget(json),
    spend: decryptExpense(json),
    income: decryptIncome(json),
    notification: decryptNotifications(json),
    currency: decrypt(json.currency, json.uid) ?? 'USD',
    theme:
      (decrypt(json.theme, json.uid) as 'device' | 'light' | 'dark') ??
      'device',
    isSocial: json.isSocial ?? false,
  };
}
