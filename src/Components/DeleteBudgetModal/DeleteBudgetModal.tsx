import React, { SetStateAction, useCallback } from 'react';
// Third Party Libraries
import Modal from 'react-modal';
import { updateDoc, doc, deleteField } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
// Custom Components
import CustomButton from '../CustomButton';
import { COLORS } from '../../Shared/commonStyles';
import { ROUTES } from '../../Shared/Constants';
import { STRINGS } from '../../Shared/Strings';
import { setLoading } from '../../Store/Loader';
import { db } from '../../Utils/firebaseConfig';
import useAppTheme from '../../Hooks/themeHook';
import { useIsDesktop } from '../../Hooks/mobileCheckHook';

function DeleteBudgetModal({
  modal,
  setModal,
  month,
  selectedCategory,
  uid,
}: Readonly<{
  modal: boolean;
  setModal: React.Dispatch<SetStateAction<boolean>>;
  month: number;
  selectedCategory: string;
  uid: string | undefined;
}>) {
  // constants
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [theme] = useAppTheme();
  const isDesktop = useIsDesktop();
  // functions
  const handlePress = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      setModal(false);
      await updateDoc(doc(db, 'users', uid!), {
        [`budget.${month}.${selectedCategory}`]: deleteField(),
      });
      toast.success(STRINGS.BudgetDeletedSuccesfully);
    } catch (e) {
      toast.error(e as string);
      toast.clearWaitingQueue();
    } finally {
      setModal(false);
      navigate(ROUTES.Budgets);
      dispatch(setLoading(false));
    }
  }, [dispatch, month, navigate, selectedCategory, setModal, uid]);
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
          border: 0,
          backgroundColor:
            theme === 'dark' ? COLORS.DARK[100] : COLORS.LIGHT[100],
          color: theme === 'dark' ? COLORS.LIGHT[100] : COLORS.DARK[100],
        },
        overlay: {
          backgroundColor: theme === 'dark' ? '#ffffff30' : '#00000050',
        },
      }}
    >
      <div className="w-full flex flex-col text-center py-5 px-5 md:px-10">
        <p className="text-3xl mb-6 font-semibold">{STRINGS.Removebudget}</p>
        <p className="text-lg mb-7">{STRINGS.SureRemoveBudgetNo}</p>
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

export default React.memo(DeleteBudgetModal);
