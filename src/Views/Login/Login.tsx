import React, { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AuthError,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  UserCredential,
} from 'firebase/auth';
import Modal from 'react-modal';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
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
import { STRINGS } from '../../Shared/Strings';
import { FirebaseAuthErrorHandler } from '../../Utils/commonFuncs';
import useAppTheme from '../../Hooks/themeHook';
import { useIsDesktop } from '../../Hooks/mobileCheckHook';

function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [form, setForm] = useState<{ email: boolean; pass: boolean }>({
    email: false,
    pass: false,
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [userCreds, setUserCreds] = useState<UserCredential>();
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogin = useCallback(async () => {
    // toast.error('esfm ');
    setForm({ email: true, pass: true });
    if (email !== '' && pass.trim() !== '') {
      try {
        dispatch(setLoading(true));
        const creds = await signInWithEmailAndPassword(auth, email, pass);
        if (creds.user.emailVerified) {
          const data = await getDoc(doc(db, 'users', creds.user.uid));
          const user = UserFromJson(data.data()!);
          dispatch(setUser(user));
          // dispatch(setTheme(undefined));
        } else {
          setIsOpen(true);
          setUserCreds(creds);
        }
        dispatch(setLoading(false));
      } catch (e) {
        const error: AuthError = e as AuthError;
        dispatch(setLoading(false));
        toast.error(FirebaseAuthErrorHandler(error.code));
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
      const error: AuthError = e as AuthError;
      toast.error(FirebaseAuthErrorHandler(error.code));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);
  const appTheme = useAppTheme();
  const isDesktop = useIsDesktop();
  return (
    <div className="w-11/12 sm:w-1/2 py-8 px-5 sm flex flex-col text-center self-center">
      <Modal
        isOpen={isOpen}
        onRequestClose={() => {
          setIsOpen(false);
        }}
        style={{
          content: {
            width: isDesktop ? '40%' : '80%',
            height: 'min-content',
            margin: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:
              appTheme[0] === 'dark' ? COLORS.DARK[100] : COLORS.LIGHT[100],
            color: appTheme[1].DARK[100],
            border: '0px',
          },
          overlay: {
            backgroundColor: appTheme[0] === 'dark' ? '#ffffff30' : '#00000050',
          },
        }}
      >
        <div className="w-full flex flex-col py-5 px-5 md:px-10 text-center">
          <p className="text-2xl sm:text-3xl mb-6 font-semibold">
            {STRINGS.PleaseVerifyEmail}
          </p>
          <p className="text-md sm:text-lg mb-7">{STRINGS.VerifyEmailSent}</p>
          <div className="flex gap-x-8">
            <CustomButton
              flex={1}
              title={STRINGS.Resend}
              onPress={async () => {
                try {
                  if (userCreds) {
                    await sendEmailVerification(userCreds.user);
                  }
                  await signOut(auth);
                } catch (e) {
                  const error: AuthError = e as AuthError;
                  toast.error(FirebaseAuthErrorHandler(error.code));
                  await signOut(auth);
                } finally {
                  setIsOpen(false);
                }
              }}
              backgroundColor={COLORS.VIOLET[20]}
              textColor={COLORS.VIOLET[100]}
            />
            <CustomButton
              flex={1}
              title={STRINGS.Ok}
              onPress={() => {
                setIsOpen(false);
              }}
            />
          </div>
        </div>
      </Modal>
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
        <p className="text-sm md:text-xl text-gray-500 font-bold">Or With</p>
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
