import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { collection, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { EmailEmptyError } from '../../Shared/errors';
import { auth, db } from '../../Utils/firebaseConfig';
import CustomButton from '../../Components/CustomButton';
import CustomInput from '../../Components/CustomInput';
import { setLoading } from '../../Store/Loader';
import { decrypt } from '../../Utils/encryption';
import { STRINGS } from '../../Shared/Strings';
import useAppTheme from '../../Hooks/themeHook';

function Forgotpassword() {
  const [email, setEmail] = useState('');
  const [form, setForm] = useState(false);
  const appTheme = useAppTheme();
  const dispatch = useDispatch();
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
      // console.log(e);
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
          toast.success(STRINGS.EmailSent);
        } else {
          toast.error(STRINGS.EmailNotRegistered);
        }
      } catch (error) {
        toast.error(error as string);
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
