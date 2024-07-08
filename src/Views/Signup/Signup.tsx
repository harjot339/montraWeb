import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Google from '../../assets/svgs/google.svg';
import CustomInput from '../../Components/CustomInput';
import CustomButton from '../../Components/CustomButton';
import { COLORS, InputBorderColor } from '../../Shared/commonStyles';
import CustomPassInput from '../../Components/CustomPassInput';
import { singupUser } from '../../Utils/firebaseFuncs';
import { emailRegex, nameRegex } from '../../Shared/Strings';
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
import { setUser } from '../../Store/Common';

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
  // redux
  const dispatch = useDispatch();
  // functions
  const handleSignup = async () => {
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
      pass.length >= 6 &&
      pass === confirmPass &&
      checked
    ) {
      try {
        dispatch(setLoading(true));
        const res = await singupUser({ name, email, pass });
        if (res) {
          //   console.log('sjdfn');
          //   //   Toast.show({ text1: STRINGS.SignupSuccesful, visibilityTime: 2000 });
          navigate(ROUTES.LOGIN, { replace: true });
        }
        dispatch(setLoading(false));
      } catch (e) {
        // const error: AuthError = e as AuthError;
        // Toast.show({
        //   text1: FirebaseAuthErrorHandler(error.code),
        //   type: 'error',
        // });
        // console.log(e.code);
        dispatch(setLoading(false));
      }
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
          //   dispatch(setTheme(undefined));
        } else {
          const data = res;
          const user = UserFromJson(data.data()!);
          if (user) {
            dispatch(setUser(user));
            // dispatch(setTheme(undefined));
          }
        }
      }
      dispatch(setLoading(false));
    } catch (e) {
      // const error: AuthError = e as AuthError;
      // Toast.show({
      //   text1: FirebaseAuthErrorHandler(error.code),
      //   type: 'error',
      // });
      console.log(e);
      dispatch(setLoading(false));
    }
  };
  return (
    <div className="w-11/12 sm:w-1/2 py-8 px-5 sm flex flex-col text-center self-center">
      <p className="text-3xl font-semibold md:text-4xl lg:text-5xl mb-16">
        Signup
      </p>
      <CustomInput
        placeholderText="Full Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <NameValError name={name} formKey={form.name} />
      <CustomInput
        placeholderText="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <EmailValError email={email} formKey={form.email} />
      <CustomPassInput
        placeholderText="Password"
        value={pass}
        onChange={(e) => {
          setPass(e.target.value);
        }}
      />
      <PassValidationError pass={pass} formKey={form.pass} />
      <CustomPassInput
        placeholderText="Confirm Password"
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
      <div className="flex justify-start mt-2">
        <input
          type="checkbox"
          className="h-7 w-7"
          value={String(checked)}
          onClick={(e) => {
            setChecked((e.target as HTMLInputElement).checked);
          }}
        />
        <p className="inline ml-4 text-xl text-start">
          By signing up, you agree to the{' '}
          <a href="." className=" text-[#7F3DFF]">
            Terms of Service and Privacy Policy
          </a>
        </p>
      </div>
      <div className="my-3" />
      <CustomButton title="Sign Up" onPress={handleSignup} />
      <div className="my-2" />
      <p className="text-sm md:text-xl text-gray-500 font-bold">Or With</p>
      <div className="my-2" />
      <CustomButton
        component={<img alt="" src={Google} width="26vw" />}
        backgroundColor={COLORS.LIGHT[100]}
        textColor={COLORS.DARK[100]}
        borderWidth={1}
        borderColor={InputBorderColor}
        title="Sign Up With Google"
        onPress={handleGoogle}
      />
      <div className="my-2" />
      <p className="text-sm md:text-xl font-bold">
        Already have an Account?{' '}
        <Link to="/login" className="underline text-[#7F3DFF]">
          Login
        </Link>
      </p>
      <div className="my-1.5" />
    </div>
  );
}

export default React.memo(Signup);
