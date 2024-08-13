import React, { SetStateAction, useCallback } from 'react';
// Third Party Libraries
import Modal from 'react-modal';
import { doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteObject, ref } from 'firebase/storage';
// Custom Components
import CustomButton from '../CustomButton';
import { COLORS } from '../../Shared/commonStyles';
import { ROUTES } from '../../Shared/Constants';
import { STRINGS } from '../../Shared/Strings';
import { setLoading } from '../../Store/Loader';
import { db, storage } from '../../Utils/firebaseConfig';
import useAppTheme from '../../Hooks/themeHook';
import { TransactionType } from '../../Defs/transaction';
import { useIsDesktop } from '../../Hooks/mobileCheckHook';
import {
  handleExpenseUpdate,
  handleIncomeUpdate,
} from '../../Utils/firebaseFuncs';
import { RootState } from '../../Store';

function DeleteTransactionModal({
  modal,
  setModal,
  uid,
  transaction,
}: Readonly<{
  modal: boolean;
  setModal: React.Dispatch<SetStateAction<boolean>>;
  uid: string | undefined;
  transaction: TransactionType | undefined;
}>) {
  // constants
  const [theme, COLOR] = useAppTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const currency = useSelector(
    (state: RootState) => state.common.user?.currency
  );
  // functions
  const handlePress = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      setModal(false);
      const curr = await getDoc(doc(db, 'users', uid!));
      const month = Timestamp.fromMillis(transaction!.timeStamp.seconds * 1000)
        .toDate()
        .getMonth();
      const { category } = transaction!;
      if (transaction!.type === 'income') {
        await handleIncomeUpdate({
          curr,
          uid: uid!,
          amount: 0,
          category,
          currency: currency!,
          month,
          transaction: transaction!,
        });
      } else {
        await handleExpenseUpdate({
          curr,
          uid: uid!,
          amount: 0,
          category,
          currency: currency!,
          month,
          transaction: transaction!,
        });
      }
      if (transaction?.attachementType !== 'none') {
        await deleteObject(ref(storage, transaction?.attachement));
      }
      await updateDoc(doc(db, 'users', uid!, 'transactions', transaction!.id), {
        deleted: true,
      });
      // deleteDoc(doc(db, 'users', uid!, 'transactions', transaction!.id));
      toast.success(STRINGS.TransactionDeletedSuccesfully);
    } catch (e) {
      toast.error(e as string);
      toast.clearWaitingQueue();
    } finally {
      setModal(false);
      navigate(ROUTES.Transactions);
      dispatch(setLoading(false));
    }
  }, [currency, dispatch, navigate, setModal, transaction, uid]);
  return (
    <Modal
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
      <div className="w-full flex flex-col text-center py-5 px-5 md:px-10">
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
            backgroundColor={COLORS.VIOLET[20]}
            textColor={COLORS.VIOLET[100]}
          />
          <CustomButton flex={1} title={STRINGS.Yes} onPress={handlePress} />
        </div>
      </div>
    </Modal>
  );
}

export default React.memo(DeleteTransactionModal);
