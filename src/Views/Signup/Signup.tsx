import React, { useCallback, useState } from 'react';
// Third Party Libraries
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AuthError, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import clsx from 'clsx';
// Custom Components
import CustomInput from '../../Components/CustomInput';
import CustomButton from '../../Components/CustomButton';
import Google from '../../assets/svgs/google.svg';
import { COLORS, InputBorderColor } from '../../Shared/commonStyles';
import CustomPassInput from '../../Components/CustomPassInput';
import { singupUser } from '../../Utils/firebaseFuncs';
import { emailRegex, nameRegex, STRINGS } from '../../Shared/Strings';
import {
  ConfirmPassError,
  EmailValError,
  NameValError,
  PassValidationError,
  testInput,
} from '../../Shared/errors';
import { setLoading } from '../../Store/Loader';
import { ROUTES } from '../../Shared/Constants';
import { auth, db } from '../../Utils/firebaseConfig';
import { UserFromJson, UserToJson } from '../../Utils/userFuncs';
import { setTheme, setUser } from '../../Store/Common';
import { FirebaseAuthErrorHandler } from '../../Utils/commonFuncs';
import useAppTheme from '../../Hooks/themeHook';

function Signup() {
  // constants
  const navigate = useNavigate();
  // state
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [pass, setPass] = useState<string>('');
  const [confirmPass, setConfirmPass] = useState<string>('');
  const [checked, setChecked] = useState<boolean>(false);
  const [form, setForm] = useState<{
    name: boolean;
    email: boolean;
    pass: boolean;
    confirmPass: boolean;
    terms: boolean;
  }>({
    name: false,
    email: false,
    pass: false,
    confirmPass: false,
    terms: false,
  });
  const appTheme = useAppTheme();
  // redux
  const dispatch = useDispatch();
  // functions
  const handleSignup = useCallback(async () => {
    setForm({
      name: true,
      email: true,
      pass: true,
      confirmPass: true,
      terms: true,
    });
    if (
      name.trim() !== '' &&
      testInput(nameRegex, name) &&
      email !== '' &&
      testInput(emailRegex, email) &&
      pass.trim() !== '' &&
      pass.trim().length >= 6 &&
      pass === confirmPass
    ) {
      if (!checked) {
        toast.error(STRINGS.TermsError);
        toast.clearWaitingQueue();
        return;
      }
      try {
        dispatch(setLoading(true));
        const res = await singupUser({ name, email, pass });
        if (res) {
          toast.success(STRINGS.EmailVerificationSent);
          navigate(ROUTES.LOGIN, { replace: true });
        }
        dispatch(setLoading(false));
      } catch (e) {
        const error: AuthError = e as AuthError;
        toast.error(FirebaseAuthErrorHandler(error.code));
        toast.clearWaitingQueue();
        dispatch(setLoading(false));
      }
    }
  }, [checked, confirmPass, dispatch, email, name, navigate, pass]);
  const handleGoogle = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const provider = new GoogleAuthProvider();
      const creds = await signInWithPopup(auth, provider);
      if (creds) {
        const res = await getDoc(doc(db, 'users', creds.user.uid));
        if (!res.exists()) {
          const user = UserToJson({
            name: creds.user.displayName!,
            email: creds.user.email!,
            uid: creds.user.uid,
            isSocial: true,
          });
          await setDoc(doc(db, 'users', creds.user.uid), user);
          dispatch(setUser(user));
          dispatch(setTheme(undefined));
        } else {
          const data = res;
          const user = UserFromJson(data.data()!);
          if (user) {
            dispatch(setUser(user));
            dispatch(setTheme(undefined));
          }
        }
      }
      dispatch(setLoading(false));
    } catch (e) {
      const error: AuthError = e as AuthError;
      toast.error(FirebaseAuthErrorHandler(error.code));
      toast.clearWaitingQueue();
      dispatch(setLoading(false));
    }
  }, [dispatch]);
  return (
    <div className="w-11/12 sm:w-1/2 px-5 sm flex flex-col text-center self-center">
      <p className="text-3xl font-semibold md:text-4xl lg:text-5xl mb-12 md:mb-8">
        {STRINGS.SIGNUP}
      </p>
      <CustomInput
        inputColor={appTheme[1].DARK[100]}
        placeholderText={STRINGS.Name}
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
        maxLength={30}
      />
      <NameValError name={name} formKey={form.name} />
      <CustomInput
        placeholderText={STRINGS.Email}
        inputColor={appTheme[1].DARK[100]}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <EmailValError email={email} formKey={form.email} />
      <CustomPassInput
        placeholderText={STRINGS.Password}
        inputColor={appTheme[1].DARK[100]}
        value={pass}
        onChange={(e) => {
          setPass(e.target.value);
        }}
      />
      <PassValidationError pass={pass} formKey={form.pass} />
      <CustomPassInput
        placeholderText={STRINGS.ConfrimPassword}
        inputColor={appTheme[1].DARK[100]}
        value={confirmPass}
        onChange={(e) => {
          setConfirmPass(e.target.value);
        }}
      />
      <ConfirmPassError
        confirmPass={confirmPass}
        pass={pass}
        formKey={form.confirmPass}
      />
      <div className="flex justify-start mt-1">
        <input
          type="checkbox"
          id="checkbox"
          className={clsx(
            'h-7 w-7 rounded-full',
            appTheme[0] === 'dark' ? 'bg-[#3b3b3b] ' : 'bg-white',
            form.terms &&
              !checked &&
              'outline-red-500 outline-2 outline outline-offset-1'
          )}
          value={String(checked)}
          onClick={(e) => {
            setChecked((e.target as HTMLInputElement).checked);
          }}
        />
        <p className="inline ml-4 text-md md:text-xl text-start">
          {STRINGS.BySigningUp}{' '}
          <Link to={ROUTES.Terms} className="inline text-[#7F3DFF]">
            {STRINGS.Terms}
          </Link>
        </p>
      </div>
      <div className="my-3" />
      <CustomButton title="Sign Up" onPress={handleSignup} />
      <div className="my-2" />
      <p className="text-sm md:text-xl text-gray-500 font-bold">{STRINGS.Or}</p>
      <div className="my-2" />
      <CustomButton
        component={<img alt="" src={Google} width="26vw" />}
        backgroundColor={COLORS.LIGHT[100]}
        textColor={COLORS.DARK[100]}
        borderWidth={1}
        borderColor={InputBorderColor}
        title={STRINGS.SignupWithGoogle}
        onPress={handleGoogle}
      />
      <div className="my-2" />
      <p className="text-md md:text-xl font-bold">
        {STRINGS.AlreadyHaveAccount}{' '}
        <Link to="/login" className="underline text-[#7F3DFF]">
          {STRINGS.LOGIN}
        </Link>
      </p>
      <div className="my-1.5" />
    </div>
  );
}

export default React.memo(Signup);
