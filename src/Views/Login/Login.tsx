import React, { useCallback, useState } from 'react';
// Third Party Libraries
import { Link } from 'react-router-dom';
import {
  AuthError,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential,
} from 'firebase/auth';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
// Custom Components
import CustomInput from '../../Components/CustomInput';
import CustomButton from '../../Components/CustomButton';
import Google from '../../assets/svgs/google.svg';
import { COLORS, InputBorderColor } from '../../Shared/commonStyles';
import CustomPassInput from '../../Components/CustomPassInput';
import { setLoading } from '../../Store/Loader';
import { setUser } from '../../Store/Common';
import { auth, db } from '../../Utils/firebaseConfig';
import { UserToJson, UserFromJson } from '../../Utils/userFuncs';
import { EmailEmptyError, PassEmptyError } from '../../Shared/errors';
import { STRINGS } from '../../Shared/Strings';
import { FirebaseAuthErrorHandler } from '../../Utils/commonFuncs';
import useAppTheme from '../../Hooks/themeHook';
import EmailVerifyModal from './atoms/EmailVerifyModal';

function Login() {
  // state
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [form, setForm] = useState<{ email: boolean; pass: boolean }>({
    email: false,
    pass: false,
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [userCreds, setUserCreds] = useState<UserCredential>();
  // constants
  const dispatch = useDispatch();
  const appTheme = useAppTheme();

  // functions
  const handleLogin = useCallback(async () => {
    setForm({ email: true, pass: true });
    if (email !== '' && pass.trim() !== '') {
      try {
        dispatch(setLoading(true));
        const creds = await signInWithEmailAndPassword(auth, email, pass);
        if (creds.user.emailVerified) {
          const data = await getDoc(doc(db, 'users', creds.user.uid));
          const user = UserFromJson(data.data()!);
          dispatch(setUser(user));
        } else {
          setIsOpen(true);
          setUserCreds(creds);
        }
        dispatch(setLoading(false));
      } catch (e) {
        const error: AuthError = e as AuthError;
        dispatch(setLoading(false));
        toast.error(FirebaseAuthErrorHandler(error.code));
        toast.clearWaitingQueue();
      }
    }
  }, [dispatch, email, pass]);
  const handleGoogle = useCallback(async () => {
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
        } else {
          const data = res;
          const user = UserFromJson(data.data()!);
          if (user) {
            dispatch(setUser(user));
          }
        }
      }
    } catch (e) {
      const error: AuthError = e as AuthError;
      toast.error(FirebaseAuthErrorHandler(error.code));
      toast.clearWaitingQueue();
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return (
    <div className="w-11/12 sm:w-1/2 py-8 px-5 sm flex flex-col text-center self-center">
      <EmailVerifyModal
        appTheme={appTheme}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        userCreds={userCreds}
      />
      <div className="max-w-2xl flex flex-col self-center w-11/12">
        <p className="text-3xl font-semibold md:text-4xl lg:text-5xl mb-16">
          {STRINGS.LOGIN}
        </p>
        <CustomInput
          inputColor={appTheme[1].DARK[100]}
          placeholderText={STRINGS.Email}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <EmailEmptyError email={email} formKey={form.email} />
        <CustomPassInput
          inputColor={appTheme[1].DARK[100]}
          placeholderText={STRINGS.Password}
          value={pass}
          onChange={(e) => {
            setPass(e.target.value);
          }}
        />
        <PassEmptyError pass={pass} formKey={form.pass} />
        <CustomButton title={STRINGS.LOGIN} onPress={handleLogin} />
        <div className="my-2" />
        <p className="text-sm md:text-xl text-gray-500 font-bold">
          {STRINGS.Or}
        </p>
        <div className="my-2" />
        <CustomButton
          component={<img alt="" src={Google} width="26vw" />}
          backgroundColor={COLORS.LIGHT[100]}
          textColor={COLORS.DARK[100]}
          borderWidth={1}
          borderColor={InputBorderColor}
          title={STRINGS.LoginGoogle}
          onPress={handleGoogle}
        />
        <div className="my-3" />
        <Link
          to="/forgot-password"
          className="text-sm md:text-xl font-bold  text-[#7F3DFF]"
        >
          {STRINGS.ForgotPassword}
        </Link>
        <div className="my-2" />
        <p className="text-sm md:text-xl font-bold">
          {STRINGS.DontHaveAccount}{' '}
          <Link to="/signup" className="underline text-[#7F3DFF]">
            {STRINGS.SIGNUP}
          </Link>
        </p>
        <div className="my-1.5" />
      </div>
    </div>
  );
}

export default React.memo(Login);
