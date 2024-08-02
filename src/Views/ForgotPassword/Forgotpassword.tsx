import React, { useState } from 'react';
// Third Party Libraries
import { sendPasswordResetEmail } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { collection, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
// Custom Components
import CustomInput from '../../Components/CustomInput';
import CustomButton from '../../Components/CustomButton';
import { EmailEmptyError } from '../../Shared/errors';
import { auth, db } from '../../Utils/firebaseConfig';
import { setLoading } from '../../Store/Loader';
import { decrypt } from '../../Utils/encryption';
import { STRINGS } from '../../Shared/Strings';
import useAppTheme from '../../Hooks/themeHook';
import { ROUTES } from '../../Shared/Constants';

function Forgotpassword() {
  const navigate = useNavigate();
  const appTheme = useAppTheme();
  // state
  const [email, setEmail] = useState('');
  const [form, setForm] = useState(false);
  // redux
  const dispatch = useDispatch();
  // functions
  async function isUserExist(currentEmail: string) {
    try {
      const snapshot = await getDocs(collection(db, 'users'));
      const res = snapshot.docs.filter((doc) => {
        return (
          (decrypt(doc.data().email, doc.data().uid) ?? '') === currentEmail
        );
      });
      return res.length !== 0;
    } catch (e) {
      return false;
    }
  }
  const handlePress = async () => {
    setForm(true);
    if (email.trim() !== '') {
      try {
        dispatch(setLoading(true));
        if (await isUserExist(email)) {
          await sendPasswordResetEmail(auth, email);
          toast.success(
            `${STRINGS.CheckYourEmail} ${email} ${STRINGS.InstructionResetPass}`
          );
          navigate(ROUTES.LOGIN);
        } else {
          toast.error(STRINGS.EmailNotRegistered);
        }
      } catch (error) {
        toast.error(error as string);
        toast.clearWaitingQueue();
      } finally {
        dispatch(setLoading(false));
      }
    }
  };
  return (
    <div className="w-11/12 sm:w-1/2 py-8 px-5 sm flex flex-col self-center">
      <div className="max-w-2xl flex flex-col self-center w-11/12">
        <p className="text-xl font-semibold md:text-3xl lg:text-4xl mb-16 text-center">
          {STRINGS.ForgotPassword}
        </p>
        <p className="text-lg font-semibold md:text-2xl lg:text-3xl mb-10">
          {STRINGS.DontWorry}
          {STRINGS.EnterEmailForReset}
        </p>
        <CustomInput
          inputColor={appTheme[1].DARK[100]}
          placeholderText="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <EmailEmptyError email={email} formKey={form} />
        <CustomButton title="Continue" onPress={handlePress} />
      </div>
    </div>
  );
}

export default React.memo(Forgotpassword);
