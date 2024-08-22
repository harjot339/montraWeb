import React, { useEffect, useState } from 'react';
import { applyActionCode, checkActionCode } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import useAppTheme from '../../Hooks/themeHook';
import { setLoading } from '../../Store/Loader';
import { auth } from '../../Utils/firebaseConfig';

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');
  // console.log(oobCode);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [emailVerified, setEmailVerifed] = useState<boolean>(false);
  useEffect(() => {
    if (!emailVerified) {
      // console.log('j');
      (async () => {
        dispatch(setLoading(true));
        if (
          oobCode === null ||
          (mode !== 'resetPassword' && mode !== 'verifyEmail')
        ) {
          navigate('*');
        } else {
          if (mode === 'resetPassword') {
            const searchParameters = new URLSearchParams(location.search);
            navigate(`/reset-pass?${searchParameters.toString()}`, {
              replace: true,
            });
            return;
          }
          try {
            // console.log(oobCode);
            const res = await checkActionCode(auth, oobCode);
            if (res.operation === 'VERIFY_EMAIL') {
              await applyActionCode(auth, oobCode);
              setEmailVerifed(true);
            }
          } catch (e) {
            // console.log(e);
            toast.error(e as string);
            navigate('*');
            toast.error('Link Expired/Already Used');
          } finally {
            dispatch(setLoading(false));
          }
        }
        dispatch(setLoading(false));
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const appTheme = useAppTheme();

  return emailVerified ? (
    <div className=" flex justify-center items-center border h-[100vh]">
      <div
        className={clsx(
          'max-w-2xl flex flex-col self-center w-11/12 px-12 py-12 rounded-2xl',
          appTheme[0] === 'dark' ? 'bg-black' : 'bg-white'
        )}
      >
        <p
          className={clsx(
            'text-3xl font-bold mb-5',
            appTheme[0] === 'dark' ? 'text-white' : 'text-black'
          )}
        >
          Your email has been successfully verified!
        </p>
        <p
          className={clsx(appTheme[0] === 'dark' ? 'text-white' : 'text-black')}
        >
          Thank you for taking the time to complete this important step. You can
          now safely close this window
        </p>
      </div>
    </div>
  ) : (
    <div />
  );
}

export default React.memo(VerifyEmail);
