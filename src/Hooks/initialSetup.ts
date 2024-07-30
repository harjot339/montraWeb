import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  collection,
  doc,
  DocumentSnapshot,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import { UserType } from '../Defs/user';
import { UserFromJson } from '../Utils/userFuncs';
import { RootState } from '../Store';
import { db } from '../Utils/firebaseConfig';
import { setUser } from '../Store/Common';
import { TransactionType } from '../Defs/transaction';
import TransFromJson from '../Utils/transFuncs';
import { setTransactions } from '../Store/Transactions';

export default function useInitialSetup() {
  const uid = useSelector((state: RootState) => state.common.user?.uid);
  const dispatch = useDispatch();
  useEffect(() => {
    try {
      if (
        'Notification' in window &&
        'serviceWorker' in navigator &&
        'PushManager' in window
      ) {
        // console.log();
        Notification.requestPermission();
        // console.log('Notification permission:', Notification.permission);
      }
    } catch (e) {
      toast.error(`Notification error:${e as string}`);
    }
    if (uid) {
      const unsubscribe = onSnapshot(
        doc(db, 'users', uid),
        (snapshot: DocumentSnapshot) => {
          const user = UserFromJson(snapshot.data() as UserType);
          dispatch(setUser(user));
        }
      );
      return () => unsubscribe();
    }
    return () => {};
  }, [dispatch, uid]);
  useEffect(() => {
    if (uid) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, 'users', uid, 'transactions'),
          orderBy('timeStamp', 'desc')
        ),
        (snapshot: QuerySnapshot) => {
          const data: TransactionType[] = snapshot.docs
            .map((x) => TransFromJson(x.data(), uid))
            .filter((item) => {
              return !item.deleted;
            });
          dispatch(setTransactions(data));
        }
      );
      return () => unsubscribe();
    }
    return () => {};
  }, [dispatch, uid]);
}
