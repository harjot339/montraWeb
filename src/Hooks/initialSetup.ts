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
  //   QuerySnapshot,
} from 'firebase/firestore';
import { UserType } from '../Defs/user';
import { UserFromJson } from '../Utils/userFuncs';
import { RootState } from '../Store';
import { db } from '../Utils/firebaseConfig';
import { setUser } from '../Store/Common';
import { TransactionType } from '../Defs/transaction';
import TransFromJson from '../Utils/transFuncs';
import { setTransactions } from '../Store/Transactions';
// import { TransactionType } from '../Defs/transaction';
// import TransFromJson from '../Utils/transFuncs';
// import { collection } from 'firebase/firestore/lite';

export default function useInitialSetup() {
  const uid = useSelector((state: RootState) => state.common.user?.uid);
  const dispatch = useDispatch();
  useEffect(() => {
    if (uid) {
      const unsubscribe = onSnapshot(
        doc(db, 'users', uid),
        (snapshot: DocumentSnapshot) => {
          const user = UserFromJson(snapshot.data() as UserType);
          // console.log('USERRR', user)
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
        // doc(db, 'users', collection('transactions')),
        (snapshot: QuerySnapshot) => {
          const data: TransactionType[] = snapshot.docs.map((x) =>
            TransFromJson(x.data(), uid)
          );
          // console.log(data)
          dispatch(setTransactions(data));
          //   dispatch()
        }
      );

      // firestore()
      //   .collection('users')
      //   .doc(uid)
      //   .collection('transactions')
      //   .orderBy('timeStamp', 'desc')
      //   .onSnapshot((snapshot: QuerySnapshot) => {
      //     const data: TransactionType[] = snapshot.docs.map((x) =>
      //       TransFromJson(x.data(), uid)
      //     );
      //     console.log(data);
      //     //   dispatch()
      //   });
      return () => unsubscribe();
    }
    return () => {};
  }, [dispatch, uid]);
}
