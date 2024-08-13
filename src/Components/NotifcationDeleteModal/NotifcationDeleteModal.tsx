import React, { SetStateAction, useCallback } from 'react';
import ReactModal from 'react-modal';
import { updateDoc, doc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { COLORS } from '../../Shared/commonStyles';
import { STRINGS } from '../../Shared/Strings';
import CustomButton from '../CustomButton';
import { useIsDesktop } from '../../Hooks/mobileCheckHook';
import useAppTheme from '../../Hooks/themeHook';
import { db } from '../../Utils/firebaseConfig';
import { setLoading } from '../../Store/Loader';

function NotifcationDeleteModal({
  modal,
  setModal,
  uid,
  setMenu,
}: Readonly<{
  modal: boolean;
  setModal: React.Dispatch<SetStateAction<boolean>>;
  setMenu: React.Dispatch<SetStateAction<boolean>>;
  uid: string | undefined;
}>) {
  const [theme] = useAppTheme();
  const isDesktop = useIsDesktop();
  const dispatch = useDispatch();
  const handlePress = useCallback(async () => {
    try {
      setMenu(false);
      dispatch(setLoading(true));
      await updateDoc(doc(db, 'users', uid!), {
        notification: {},
      });
      setModal(false);
    } catch (e) {
      toast.error(e as string);
      toast.clearWaitingQueue();
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, setMenu, setModal, uid]);
  return (
    <ReactModal
      isOpen={modal}
      onRequestClose={() => {
        setModal(false);
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
          border: 0,
          backgroundColor:
            theme === 'dark' ? COLORS.DARK[100] : COLORS.LIGHT[100],
          color: theme === 'dark' ? COLORS.LIGHT[100] : COLORS.DARK[100],
        },
        overlay: {
          zIndex: 99999,
          backgroundColor: theme === 'dark' ? '#ffffff30' : '#00000050',
        },
      }}
    >
      <div className="w-full flex flex-col text-center py-5 px-5 md:px-10">
        <p className="text-3xl mb-6 font-semibold">{STRINGS.AreYouSure}</p>
        <p className="text-lg mb-7">{STRINGS.AreYouSureDelete}</p>
        <div className="flex gap-x-8">
          <CustomButton
            flex={1}
            title={STRINGS.No}
            onPress={() => {
              setModal(false);
            }}
            backgroundColor={COLORS.VIOLET[20]}
            textColor={COLORS.VIOLET[100]}
          />
          <CustomButton flex={1} title={STRINGS.Yes} onPress={handlePress} />
        </div>
      </div>
    </ReactModal>
  );
}

export default React.memo(NotifcationDeleteModal);
