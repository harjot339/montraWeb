import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import Google from '../../assets/svgs/google.svg';
import CustomInput from '../../Components/CustomInput';
import CustomButton from '../../Components/CustomButton';
import { COLORS, InputBorderColor } from '../../Shared/commonStyles';
import CustomPassInput from '../../Components/CustomPassInput';
import { setLoading } from '../../Store/Loader';
import { setUser } from '../../Store/Common';
import { auth, db } from '../../Utils/firebaseConfig';
import { UserToJson, UserFromJson } from '../../Utils/userFuncs';
import { EmailEmptyError, PassEmptyError } from '../../Shared/errors';

function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [form, setForm] = useState<{ email: boolean; pass: boolean }>({
    email: false,
    pass: false,
  });
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogin = async () => {
    setForm({ email: true, pass: true });
    if (email !== '' && pass.trim() !== '') {
      try {
        dispatch(setLoading(true));
        const creds = await signInWithEmailAndPassword(auth, email, pass);
        if (creds.user.emailVerified) {
          const data = await getDoc(doc(db, 'users', creds.user.uid));
          const user = UserFromJson(data.data()!);
          dispatch(setUser(user));
          // navigate('wishlist', { replace: true });
          // dispatch(setTheme(undefined));
        } else {
          // setAlert(true);
          // alert(STRINGS.PleaseVerifyEmail);
          // Alert.alert(STRINGS.PleaseVerifyEmail, STRINGS.VerifyEmailSent, [
          //   {
          //     text: 'Resend',
          //     onPress: () => {
          //       (async () => {
          // try {
          //   await creds.user.sendEmailVerification();
          //   await auth().signOut();
          // } catch (e) {
          //   console.log(e);
          //   await auth().signOut();
          // }
          //       })();
          //     },
          //   },
          //   {
          //     text: 'OK',
          //     onPress: () => {
          //       (async () => {
          //         await auth().signOut();
          //       })();
          //     },
          //   },
          // ]);
        }
      } catch (e) {
        // const error: FirebaseAuthTypes.NativeFirebaseAuthError = e;
        // console.log(e);
        // Toast.show({
        //   text1: FirebaseAuthErrorHandler(error.code),
        //   type: 'error',
        // });
      }
      dispatch(setLoading(false));
    }
  };
  const handleGoogle = async () => {
    try {
      dispatch(setLoading(true));
      const provider = new GoogleAuthProvider();
      const creds = await signInWithPopup(auth, provider);
      if (creds) {
        const res = await getDoc(doc(db, 'users', creds.user.uid));
        if (!res.exists) {
          const user = UserToJson({
            name: creds.user.displayName!,
            email: creds.user.email!,
            uid: creds.user.uid,
            isSocial: true,
          });
          await setDoc(doc(db, 'users', creds.user.uid), user);
          dispatch(setUser(user));
          // dispatch(setTheme(undefined));
        } else {
          const data = res;
          const user = UserFromJson(data.data()!);
          if (user) {
            dispatch(setUser(user));
            // dispatch(setTheme(undefined));
          }
        }
      }
    } catch (e) {
      // const error: FirebaseAuthTypes.NativeFirebaseAuthError = e;
      // if (
      //   error.message !==
      //   'android.credentials.GetCredentialException.TYPE_USER_CANCELED'
      // ) {
      //   Toast.show({
      //     text1: FirebaseAuthErrorHandler(error.code),
      //     type: 'error',
      //   });
      // }
      // console.log(e);
    } finally {
      dispatch(setLoading(false));
    }
  };
  return (
    <div className="w-11/12 sm:w-1/2 py-8 px-5 sm flex flex-col text-center self-center">
      <div className="max-w-2xl flex flex-col self-center w-11/12">
        <p className="text-3xl font-semibold md:text-4xl lg:text-5xl mb-16">
          Login
        </p>
        <CustomInput
          placeholderText="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <EmailEmptyError email={email} formKey={form.email} />
        <CustomPassInput
          placeholderText="Password"
          value={pass}
          onChange={(e) => {
            setPass(e.target.value);
          }}
        />
        <PassEmptyError pass={pass} formKey={form.pass} />
        <CustomButton title="Login" onPress={handleLogin} />
        <div className="my-2" />
        <p className="text-sm md:text-xl text-gray-500 font-bold">Or With</p>
        <div className="my-2" />
        <CustomButton
          component={<img alt="" src={Google} width="26vw" />}
          backgroundColor={COLORS.LIGHT[100]}
          textColor={COLORS.DARK[100]}
          borderWidth={1}
          borderColor={InputBorderColor}
          title="Login With Google"
          onPress={handleGoogle}
        />
        <div className="my-3" />
        <Link
          to="/forgot-password"
          className="text-sm md:text-xl font-bold  text-[#7F3DFF]"
        >
          Forgot Password ?
        </Link>
        <div className="my-2" />
        <p className="text-sm md:text-xl font-bold">
          Don&apos;t have an Account?{' '}
          <Link to="/signup" className="underline text-[#7F3DFF]">
            Signup
          </Link>
        </p>
        <div className="my-1.5" />
      </div>
    </div>
  );
}

export default React.memo(Login);
