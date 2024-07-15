import React, { SetStateAction } from 'react';
import Modal from 'react-modal';
import { deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../Shared/commonStyles';
import { ROUTES } from '../../Shared/Constants';
import { STRINGS } from '../../Shared/Strings';
import { setLoading } from '../../Store/Loader';
import { db } from '../../Utils/firebaseConfig';
import CustomButton from '../CustomButton';
import useAppTheme from '../../Hooks/themeHook';
import { TransactionType } from '../../Defs/transaction';

function DeleteTransactionModal({
  modal,
  setModal,
  uid,
  transaction,
}: {
  modal: boolean;
  setModal: React.Dispatch<SetStateAction<boolean>>;
  uid: string | undefined;
  transaction: TransactionType | undefined;
}) {
  const [theme, COLOR] = useAppTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
            theme === 'dark' ? COLORS.DARK[100] : COLORS.LIGHT[100],
          color: COLOR.DARK[100],
          border: 0,
        },
        overlay: {
          backgroundColor: theme === 'dark' ? '#ffffff30' : '#00000050',
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
        <p className="text-3xl mb-6 font-semibold">
          {STRINGS.RemovethisTransaction}
        </p>
        <p className="text-lg mb-7">{STRINGS.sureRemoveTransaction}</p>
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
              try {
                dispatch(setLoading(true));
                await deleteDoc(
                  doc(db, 'users', uid!, 'transactions', transaction!.id!)
                );
                toast.success(STRINGS.TransactionDeletedSuccesfully);
              } catch (e) {
                toast.error(e as string);
              } finally {
                setModal(false);
                navigate(ROUTES.Transactions);
                dispatch(setLoading(false));
              }
            }}
            backgroundColor={COLORS.VIOLET[20]}
            textColor={COLORS.VIOLET[100]}
          />
        </div>
      </div>
    </Modal>
  );
}

export default React.memo(DeleteTransactionModal);
