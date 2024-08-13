import {
  AuthError,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from 'firebase/auth';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { auth } from '../../Utils/firebaseConfig';
import { ROUTES } from '../../Shared/Constants';
import CustomButton from '../../Components/CustomButton';
import CustomPassInput from '../../Components/CustomPassInput';
import {
  ConfirmPassError,
  PassValidationError,
  testInput,
} from '../../Shared/errors';
import { passRegex, STRINGS } from '../../Shared/Strings';
import useAppTheme from '../../Hooks/themeHook';
import { FirebaseAuthErrorHandler } from '../../Utils/commonFuncs';
import { setLoading } from '../../Store/Loader';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      dispatch(setLoading(true));
      if (oobCode === null || mode !== 'resetPassword') {
        navigate('*');
      } else {
        try {
          await verifyPasswordResetCode(auth, oobCode ?? '');
          try {
            const appScheme = `montra://reset-pass?mode=${mode}&oobCode=${oobCode}&apiKey=AIzaSyCM9RbkSojJOxzcKPOUqIrOPQLhHfYFYYU&lang=en`;
            window.location.href = appScheme;
          } catch (e) {
            toast.error(e as string);
          }
        } catch (e) {
          toast.error(e as string);
          navigate('*');
          toast.error('Link Expired/Already Used');
        } finally {
          dispatch(setLoading(false));
        }
      }
      dispatch(setLoading(false));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, oobCode]);
  const appTheme = useAppTheme();
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [form, setForm] = useState({ pass: false, confirmPass: false });

  const handlePress = useCallback(async () => {
    setForm({ pass: true, confirmPass: true });
    if (
      pass.trim() !== '' &&
      testInput(passRegex, pass) &&
      pass === confirmPass
    ) {
      dispatch(setLoading(true));
      try {
        await confirmPasswordReset(auth, oobCode!, confirmPass);
        navigate(ROUTES.LOGIN);
        toast.success(STRINGS.PasswordResetSucessful);
      } catch (e) {
        const error: AuthError = e as AuthError;
        toast.error(FirebaseAuthErrorHandler(error.code));
      } finally {
        dispatch(setLoading(false));
      }
    }
  }, [confirmPass, dispatch, navigate, oobCode, pass]);
  return (
    <div className=" flex justify-center items-center border h-[100vh]">
      <div className="max-w-2xl flex flex-col self-center w-11/12 bg-white px-12 py-12 rounded-2xl">
        <p className="text-3xl font-semibold md:text-4xl lg:text-5xl mb-16 text-center">
          {STRINGS.ResetPassword}
        </p>
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
        <div className="my-3" />
        <CustomButton title={STRINGS.ResetPassword} onPress={handlePress} />
      </div>
    </div>
  );
}
