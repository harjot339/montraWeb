import React, { SetStateAction } from 'react';
import Modal from 'react-modal';
import { updateDoc, doc, deleteField } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { COLORS } from '../../Shared/commonStyles';
import { ROUTES } from '../../Shared/Constants';
import { STRINGS } from '../../Shared/Strings';
import { setLoading } from '../../Store/Loader';
import { db } from '../../Utils/firebaseConfig';
import CustomButton from '../CustomButton';
import useAppTheme from '../../Hooks/themeHook';

function DeleteBudgetModal({
  modal,
  setModal,
  month,
  selectedCategory,
  uid,
}: {
  modal: boolean;
  setModal: React.Dispatch<SetStateAction<boolean>>;
  month: number;
  selectedCategory: string;
  uid: string | undefined;
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [theme] = useAppTheme();
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
      <div
        style={{
          width: '30vw',
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          padding: '20px 50px',
        }}
      >
        <p className="text-3xl mb-6 font-semibold">{STRINGS.Removebudget}</p>
        <p className="text-lg mb-7">{STRINGS.SureRemoveBudgetNo}</p>
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
                setModal(false);
                dispatch(setLoading(true));
                await updateDoc(doc(db, 'users', uid!), {
                  [`budget.${month}.${selectedCategory}`]: deleteField(),
                });
                toast.success(STRINGS.BudgetDeletedSuccesfully);
              } catch (e) {
                toast.error(e as string);
              } finally {
                setModal(false);
                navigate(ROUTES.Budgets);
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

export default React.memo(DeleteBudgetModal);
