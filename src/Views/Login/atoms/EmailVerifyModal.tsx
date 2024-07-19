import React, { SetStateAction } from 'react';
// Third Party Libraries
import {
  sendEmailVerification,
  signOut,
  AuthError,
  UserCredential,
} from 'firebase/auth';
import { toast } from 'react-toastify';
import ReactModal from 'react-modal';
import { useDispatch } from 'react-redux';
// Custom Components
import CustomButton from '../../../Components/CustomButton';
import { COLORS } from '../../../Shared/commonStyles';
import { STRINGS } from '../../../Shared/Strings';
import { FirebaseAuthErrorHandler } from '../../../Utils/commonFuncs';
import { auth } from '../../../Utils/firebaseConfig';
import { useIsDesktop } from '../../../Hooks/mobileCheckHook';
import { setLoading } from '../../../Store/Loader';

function EmailVerifyModal({
  isOpen,
  setIsOpen,
  appTheme,
  userCreds,
}: Readonly<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  appTheme: ['dark' | 'light', typeof COLORS];
  userCreds: UserCredential | undefined;
}>) {
  const isDesktop = useIsDesktop();
  const dispatch = useDispatch();
  return (
    <ReactModal
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
              dispatch(setLoading(true));
              setIsOpen(false);
              try {
                if (userCreds) {
                  await sendEmailVerification(userCreds.user);
                }
                await signOut(auth);
                toast.success(STRINGS.EmailVerificationSent);
              } catch (e) {
                const error: AuthError = e as AuthError;
                toast.error(FirebaseAuthErrorHandler(error.code));
                toast.clearWaitingQueue();
                await signOut(auth);
              } finally {
                dispatch(setLoading(false));
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
    </ReactModal>
  );
}

export default React.memo(EmailVerifyModal);
