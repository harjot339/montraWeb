import React, { SetStateAction, useCallback, useState } from 'react';
// Third Party Librarires
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { doc, updateDoc } from 'firebase/firestore';
// Custom Components
import CustomInput from '../CustomInput';
import { EmptyError } from '../../Shared/errors';
import CustomButton from '../CustomButton';
import { addExpenseCategory, addIncomeCategory } from '../../Store/Common';
import { setLoading } from '../../Store/Loader';
import { STRINGS } from '../../Shared/Strings';
import { RootState } from '../../Store';
import { db } from '../../Utils/firebaseConfig';
import { encrypt } from '../../Utils/encryption';
import { COLORS } from '../../Shared/commonStyles';
import { useIsDesktop } from '../../Hooks/mobileCheckHook';
import useAppTheme from '../../Hooks/themeHook';

function CategoryModal({
  modal,
  setModal,
  type,
  setMyCategory,
}: Readonly<{
  modal: boolean;
  setModal: React.Dispatch<SetStateAction<boolean>>;
  setMyCategory: React.Dispatch<SetStateAction<string>>;
  type: 'expense' | 'income' | 'transfer';
}>) {
  // state
  const [form, setForm] = useState<boolean>(false);
  const [category, setCategory] = useState<string>('');
  // redux
  const dispatch = useDispatch();
  const uid = useSelector((state: RootState) => state.common.user?.uid);
  const expenseCats = useSelector(
    (state: RootState) => state.common.user?.expenseCategory
  );
  const incomeCats = useSelector(
    (state: RootState) => state.common.user?.incomeCategory
  );
  // constants
  const [theme, COLOR] = useAppTheme();
  const isDesktop = useIsDesktop();
  // functions
  const handlePress = useCallback(async () => {
    setForm(true);
    if (category !== '') {
      dispatch(setLoading(true));
      if (
        type === 'expense'
          ? expenseCats?.includes(category.toLowerCase())
          : incomeCats?.includes(category.toLowerCase())
      ) {
        toast.error(`${category}${STRINGS.AlreadyAdded}`);
        toast.clearWaitingQueue();
        dispatch(setLoading(false));
        return;
      }
      try {
        setModal(false);
        if (type === 'expense') {
          dispatch(addExpenseCategory(category.toLowerCase()));
          await updateDoc(doc(db, 'users', uid!), {
            expenseCategory: [...expenseCats!, category.toLowerCase()].map(
              (item) => encrypt(item, uid!)
            ),
          });
        } else if (type === 'income') {
          dispatch(addIncomeCategory(category.toLowerCase()));
          await updateDoc(doc(db, 'users', uid!), {
            incomeCategory: [...incomeCats!, category.toLowerCase()].map(
              (item) => encrypt(item, uid!)
            ),
          });
        }
        setMyCategory(category.toLocaleLowerCase().trim());
      } catch (e) {
        toast.error(e as string);
        toast.clearWaitingQueue();
      } finally {
        setForm(false);
        setCategory('');
        dispatch(setLoading(false));
      }
    }
  }, [
    category,
    dispatch,
    expenseCats,
    incomeCats,
    setModal,
    setMyCategory,
    type,
    uid,
  ]);
  return (
    <Modal
      isOpen={modal}
      onRequestClose={() => {
        setCategory('');
        setModal(false);
        setForm(false);
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
        },
        overlay: {
          backgroundColor: theme === 'dark' ? '#ffffff30' : '#00000050',
        },
      }}
    >
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <CustomInput
          inputColor={COLOR.DARK[100]}
          placeholderText={STRINGS.Category}
          onChange={(e) => {
            setCategory(e.target.value);
          }}
          value={category}
          maxLength={20}
        />
        <EmptyError
          errorText={STRINGS.CategoryCannotBeEmpty}
          formKey={form}
          value={category}
        />
        <CustomButton title={STRINGS.Add} onPress={handlePress} />
      </div>
    </Modal>
  );
}

export default React.memo(CategoryModal);
