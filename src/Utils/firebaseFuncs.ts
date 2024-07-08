import {
  AuthError,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import { UserToJson } from './userFuncs';

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
    console.log(error);
    // Toast.show({ text1: FirebaseAuthErrorHandler(error.code), type: 'error' });
    return false;
  }
  return false;
}

export const a = 10;
