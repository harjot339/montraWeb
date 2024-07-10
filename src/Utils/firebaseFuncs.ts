import {
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
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from './firebaseConfig';
import { UserFromJson, UserToJson } from './userFuncs';
import { RepeatDataType, TransactionType } from '../Defs/transaction';
import { encrypt } from './encryption';
import { UserType } from '../Defs/user';

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
    // const error: AuthError = e as AuthError;
    // console.log(error);
    // Toast.show({ text1: FirebaseAuthErrorHandler(error.code), type: 'error' });
    return false;
  }
  return false;
}
export async function getAttachmentUrl({
  attachement,
  attachementType,
  id,
  uid,
}: {
  attachement: File | undefined;
  attachementType: TransactionType['attachementType'];
  id: string;
  uid: string;
}) {
  let url = '';
  try {
    if (attachementType !== 'none' && attachement) {
      // if (!attachement?.startsWith('https://firebasestorage.googleapis.com')) {
      await uploadBytes(ref(storage, `users/${uid}/${id}`), attachement);
      url = await getDownloadURL(ref(storage, `users/${uid}/${id}`));
      // } else {
      //   url = attachement;
      // }
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
    // if (category !== 'transfer') {
    //   await handleOnlineNotify({
    //     category,
    //     month,
    //     uid,
    //     totalSpent: finalAmount,
    //     curr,
    //   });
    // }
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
    // if (category !== 'transfer') {
    //   await handleOnlineNotify({
    //     category,
    //     month,
    //     uid,
    //     totalSpent: finalAmount,
    //     curr,
    //   });
    // }
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
  });
  const trans = createTransaction({
    id,
    url,
    attachementType,
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
