import {
  AuthError,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import {
  doc,
  DocumentSnapshot,
  getDoc,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { auth, db, storage } from './firebaseConfig';
import { UserFromJson, UserToJson } from './userFuncs';
import { RepeatDataType, TransactionType } from '../Defs/transaction';
import { encrypt } from './encryption';
import { UserType } from '../Defs/user';
import { FirebaseAuthErrorHandler } from './commonFuncs';

export async function singupUser({
  name,
  email,
  pass,
}: {
  name: string;
  email: string;
  pass: string;
}) {
  try {
    const creds = await createUserWithEmailAndPassword(auth, email, pass);
    if (creds) {
      const encrpytedUser = UserToJson({
        name,
        email,
        uid: creds.user.uid,
        isSocial: false,
      });
      // console.log(encrpytedUser)
      await setDoc(doc(db, 'users', creds.user.uid), encrpytedUser);
      await sendEmailVerification(creds.user);
      return true;
    }
  } catch (e) {
    const error: AuthError = e as AuthError;
    toast.error(FirebaseAuthErrorHandler(error.code));
    toast.clearWaitingQueue();
    return false;
  }
  return false;
}
export async function getAttachmentUrl({
  prevTransaction,
  isEdit,
  attachement,
  attachementType,
  id,
  uid,
}: {
  isEdit: boolean;
  prevTransaction: TransactionType | undefined;
  attachement: File | undefined;
  attachementType: TransactionType['attachementType'];
  id: string;
  uid: string;
}) {
  let url = '';
  try {
    if (
      isEdit &&
      attachement !== undefined &&
      prevTransaction?.attachementType !== 'none'
    ) {
      return prevTransaction?.attachement ?? '';
    }
    if (attachementType !== 'none' && attachement) {
      await uploadBytes(ref(storage, `users/${uid}/${id}`), attachement);
      url = await getDownloadURL(ref(storage, `users/${uid}/${id}`));
    }
  } catch (e) {
    // console.log(e)
  }
  return url;
}
export function createTransaction({
  id,
  url,
  attachementType,
  amount,
  conversion,
  currency,
  category,
  desc,
  wallet,
  repeatData,
  isEdit,
  transaction,
  pageType,
  uid,
  from,
  to,
}: {
  id: string;
  url: string;
  attachementType: TransactionType['attachementType'];
  amount: string;
  conversion: {
    [key: string]: {
      [key: string]: number;
    };
  };
  currency: string;
  category: string;
  desc: string;
  wallet: string;
  repeatData: RepeatDataType;
  isEdit: boolean;
  transaction: TransactionType;
  pageType: TransactionType['type'];
  uid: string;
  from: string;
  to: string;
}) {
  return {
    amount: encrypt(
      String(
        (Number(amount) / conversion.usd[currency.toLowerCase()]).toFixed(10)
      ),
      uid
    ),
    category: encrypt(category, uid),
    desc: encrypt(desc, uid),
    wallet: encrypt(wallet, uid),
    attachement: encrypt(url, uid),
    repeat: repeatData !== undefined,
    freq: repeatData
      ? {
          freq: encrypt(repeatData.freq, uid),
          month: encrypt(String(repeatData.month), uid),
          day: encrypt(String(repeatData.day), uid),
          weekDay: encrypt(String(repeatData.weekDay), uid),
          end: encrypt(repeatData.end, uid),
          date: repeatData.date,
        }
      : null,
    id: isEdit ? transaction.id : id,
    timeStamp: isEdit ? transaction.timeStamp : Timestamp.now(),
    type: encrypt(pageType, uid),
    attachementType: encrypt(attachementType, uid),
    from: encrypt(from, uid),
    to: encrypt(to, uid),
  };
}

export async function handleIncomeUpdate({
  curr,
  uid,
  month,
  category,
  transaction,
  amount,
  conversion,
  currency,
}: {
  curr: DocumentSnapshot;
  uid: string;
  month: number;
  category: string;
  transaction: TransactionType;
  amount: number;
  conversion: {
    [key: string]: {
      [key: string]: number;
    };
  };
  currency: string;
}) {
  const finalAmount =
    (UserFromJson(curr.data() as UserType)?.income?.[month]?.[category] ?? 0) -
    transaction.amount +
    Number(amount / conversion.usd[currency.toLowerCase()]);
  await updateDoc(doc(db, 'users', uid), {
    [`income.${month}.${category}`]: encrypt(String(finalAmount), uid),
  });
}
export async function handleOnlineNotify({
  curr,
  totalSpent,
  uid,
  month,
  category,
}: {
  curr: DocumentSnapshot;
  totalSpent: number;
  uid: string;
  month: number;
  category: string;
}) {
  const totalBudget = UserFromJson(curr.data() as UserType)?.budget?.[month]?.[
    category
  ];
  if (totalBudget.alert) {
    if (
      totalBudget &&
      (totalSpent >= totalBudget.limit ||
        totalSpent >= totalBudget.limit * (totalBudget.percentage / 100))
    ) {
      try {
        const notificationId = uuidv4();
        await Notification.requestPermission();
        if (totalSpent >= totalBudget.limit) {
          await updateDoc(doc(db, 'users', uid), {
            [`notification.${notificationId}`]: {
              type: encrypt('budget-limit', uid),
              category: encrypt(category, uid),
              id: notificationId,
              time: Timestamp.now(),
              read: false,
              percentage: totalBudget.percentage,
            },
          });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const notif = new Notification(
            `${
              category[0].toUpperCase() + category.slice(1)
            } Budget Limit Exceeded`,
            {
              body: `Your ${category[0].toUpperCase()}${category.slice(
                1
              )} budget has exceeded the limit`,
            }
          );
          // console.log(notif);
        } else if (
          totalSpent >=
          totalBudget.limit * (totalBudget.percentage / 100)
        ) {
          await updateDoc(doc(db, 'users', uid), {
            [`notification.${notificationId}`]: {
              type: encrypt('budget-percent', uid),
              category: encrypt(category, uid),
              id: notificationId,
              time: Timestamp.now(),
              read: false,
              percentage: totalBudget.percentage,
            },
          });
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const notif = new Notification(
            `Exceeded ${totalBudget.percentage}% of ${
              category[0].toUpperCase() + category.slice(1)
            } budget`,
            {
              body: `You've exceeded ${totalBudget.percentage}% of your ${
                category[0].toUpperCase() + category.slice(1)
              } budget. Take action to stay on track.`,
            }
          );
          // console.log(notif);
        }
      } catch (e) {
        toast.error(e as string);
        toast.clearWaitingQueue();
      }
    }
  }
}
export async function handleNewIncome({
  curr,
  uid,
  month,
  category,
  amount,
  conversion,
  currency,
}: {
  curr: DocumentSnapshot;
  uid: string;
  month: number;
  category: string;
  amount: number;
  conversion: {
    [key: string]: {
      [key: string]: number;
    };
  };
  currency: string;
}) {
  const finalAmount =
    (UserFromJson(curr.data() as UserType)?.income[month]?.[category] ?? 0) +
    Number(amount) / conversion.usd[currency.toLowerCase()];
  await updateDoc(doc(db, 'users', uid), {
    [`income.${month}.${category}`]: encrypt(String(finalAmount), uid),
  });
}

export async function handleExpenseUpdate({
  curr,
  uid,
  month,
  category,
  transaction,
  amount,
  conversion,
  currency,
}: {
  curr: DocumentSnapshot;
  uid: string;
  month: number;
  category: string;
  transaction: TransactionType;
  amount: number;
  conversion: {
    [key: string]: {
      [key: string]: number;
    };
  };
  currency: string;
}) {
  try {
    const finalAmount =
      (UserFromJson(curr.data() as UserType)?.spend?.[month]?.[category] ?? 0) -
      transaction.amount +
      Number(amount) / conversion.usd[currency.toLowerCase()];
    await updateDoc(doc(db, 'users', uid), {
      [`spend.${month}.${category}`]: encrypt(String(finalAmount), uid),
    });
    if (category !== 'transfer') {
      await handleOnlineNotify({
        category,
        month,
        uid,
        totalSpent: finalAmount,
        curr,
      });
    }
  } catch (e) {
    // console.log('ERROR', e)
  }
}

export async function handleNewExpense({
  curr,
  uid,
  month,
  category,
  amount,
  conversion,
  currency,
}: {
  curr: DocumentSnapshot;
  uid: string;
  month: number;
  category: string;
  amount: number;
  conversion: {
    [key: string]: {
      [key: string]: number;
    };
  };
  currency: string;
}) {
  try {
    const finalAmount =
      (UserFromJson(curr.data() as UserType)?.spend[month]?.[category] ?? 0) +
      Number(amount) / conversion.usd[currency.toLowerCase()];
    await updateDoc(doc(db, 'users', uid), {
      [`spend.${month}.${category}`]: encrypt(String(finalAmount), uid),
    });
    if (category !== 'transfer') {
      await handleOnlineNotify({
        category,
        month,
        uid,
        totalSpent: finalAmount,
        curr,
      });
    }
  } catch (e) {
    // console.log(e)
  }
}
export const handleOnline = async ({
  id,
  attachement,
  attachementType,
  uid,
  amount,
  pageType,
  conversion,
  currency,
  category,
  desc,
  isEdit,
  repeatData,
  prevTransaction,
  wallet,
  from,
  to,
  month,
}: {
  id: string;
  attachement: File | undefined;
  attachementType: TransactionType['attachementType'];
  uid: string;
  amount: string;
  pageType: TransactionType['type'];
  conversion: {
    [key: string]: {
      [key: string]: number;
    };
  };
  currency: string | undefined;
  category: string | undefined;
  desc: string;
  isEdit: boolean;
  repeatData: RepeatDataType | undefined;
  prevTransaction: TransactionType | undefined;
  wallet: string;
  from: string;
  to: string;
  month: number;
}) => {
  const url = await getAttachmentUrl({
    attachement,
    attachementType,
    id,
    uid,
    prevTransaction,
    isEdit,
  });
  const trans = createTransaction({
    id,
    url,
    attachementType:
      isEdit &&
      attachement !== undefined &&
      prevTransaction?.attachementType !== 'none'
        ? prevTransaction?.attachementType ?? 'none'
        : attachementType,
    amount: amount.replace(/,/g, ''),
    category: pageType === 'transfer' ? 'transfer' : category!,
    conversion,
    currency: currency!,
    desc,
    isEdit,
    pageType,
    repeatData: repeatData!,
    transaction: prevTransaction!,
    wallet,
    uid,
    from,
    to,
  });
  const curr = await getDoc(doc(db, 'users', uid));
  if (isEdit) {
    if (pageType === 'expense') {
      await handleExpenseUpdate({
        curr,
        amount: Number(amount.replace(/,/g, '')),
        category: category!,
        conversion,
        currency: currency!,
        month,
        transaction: prevTransaction!,
        uid,
      });
    } else if (pageType === 'income') {
      await handleIncomeUpdate({
        curr,
        amount: Number(amount.replace(/,/g, '')),
        category: category!,
        conversion,
        currency: currency!,
        month,
        transaction: prevTransaction!,
        uid,
      });
    } else {
      await handleExpenseUpdate({
        curr,
        amount: Number(amount.replace(/,/g, '')),
        category: 'transfer',
        conversion,
        currency: currency!,
        month,
        transaction: prevTransaction!,
        uid,
      });
    }
    await updateDoc(
      doc(db, 'users', uid, 'transactions', prevTransaction!.id),
      trans
    );
  } else {
    if (pageType === 'expense') {
      await handleNewExpense({
        curr,
        amount: Number(amount.replace(/,/g, '')),
        category: category!,
        conversion,
        currency: currency!,
        month,
        uid,
      });
    } else if (pageType === 'income') {
      await handleNewIncome({
        curr,
        amount: Number(amount.replace(/,/g, '')),
        category: category!,
        conversion,
        currency: currency!,
        month,
        uid,
      });
    } else {
      await handleNewExpense({
        curr,
        amount: Number(amount.replace(/,/g, '')),
        category: 'transfer',
        conversion,
        currency: currency!,
        month,
        uid,
      });
    }
    await setDoc(doc(db, 'users', uid, 'transactions', id), trans);
  }
};
