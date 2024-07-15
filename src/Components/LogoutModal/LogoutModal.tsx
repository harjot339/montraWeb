import { signOut } from 'firebase/auth';
import React, { SetStateAction } from 'react';
import Modal from 'react-modal';
import { useDispatch } from 'react-redux';
import { COLORS } from '../../Shared/commonStyles';
import { STRINGS } from '../../Shared/Strings';
import { setUser } from '../../Store/Common';
import { auth } from '../../Utils/firebaseConfig';
import CustomButton from '../CustomButton';
import useAppTheme from '../../Hooks/themeHook';

function LogoutModal({
  modal,
  setModal,
}: {
  modal: boolean;
  setModal: React.Dispatch<SetStateAction<boolean>>;
}) {
  const [appTheme, COLOR] = useAppTheme();
  const dispatch = useDispatch();
  return (
    <Modal
      isOpen={modal}
      onRequestClose={() => {
        setModal(false);
      }}
      style={{
        content: {
          width: 'min-content',
          height: 'min-content',
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor:
            appTheme === 'dark' ? COLORS.DARK[100] : COLORS.LIGHT[100],
          color: COLOR.DARK[100],
          border: 0,
        },
        overlay: {
          backgroundColor: appTheme === 'dark' ? '#ffffff30' : '#00000050',
        },
      }}
    >
      <div
        style={{
          width: '30vw',
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          padding: '20px 50px',
        }}
      >
        <p className="text-3xl mb-6 font-semibold">{STRINGS.Logout}</p>
        <p className="text-lg mb-7">{STRINGS.SureLogout}</p>
        <div className="flex gap-x-8">
          <CustomButton
            flex={1}
            title={STRINGS.No}
            onPress={() => {
              setModal(false);
            }}
          />
          <CustomButton
            flex={1}
            title={STRINGS.Yes}
            onPress={async () => {
              await signOut(auth);
              dispatch(setUser(undefined));
            }}
            backgroundColor={COLORS.VIOLET[20]}
            textColor={COLORS.VIOLET[100]}
          />
        </div>
      </div>
    </Modal>
  );
}

export default React.memo(LogoutModal);
