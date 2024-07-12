import React, { SetStateAction, useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { doc, updateDoc } from 'firebase/firestore';
import CustomInput from '../CustomInput';
import { EmptyError } from '../../Shared/errors';
import CustomButton from '../CustomButton';
import { STRINGS } from '../../Shared/Strings';
import { setLoading } from '../../Store/Loader';
import { RootState } from '../../Store';
import { db } from '../../Utils/firebaseConfig';
import { addExpenseCategory, addIncomeCategory } from '../../Store/Common';
import { encrypt } from '../../Utils/encryption';

function CategoryModal({
  modal,
  setModal,
  type,
  setMyCategory,
}: {
  modal: boolean;
  setModal: React.Dispatch<SetStateAction<boolean>>;
  setMyCategory: React.Dispatch<SetStateAction<string>>;
  type: 'expense' | 'income' | 'transfer';
}) {
  const [form, setForm] = useState<boolean>(false);
  const [category, setCategory] = useState<string>('');
  const dispatch = useDispatch();
  const uid = useSelector((state: RootState) => state.common.user?.uid);
  const expenseCats = useSelector(
    (state: RootState) => state.common.user?.expenseCategory
  );
  const incomeCats = useSelector(
    (state: RootState) => state.common.user?.incomeCategory
  );
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
          width: 'min-content',
          height: 'min-content',
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        },
        overlay: {
          backgroundColor: '#00000050',
        },
      }}
    >
      <div style={{ width: '30vw', display: 'flex', flexDirection: 'column' }}>
        <CustomInput
          placeholderText="Category"
          onChange={(e) => {
            setCategory(e.target.value);
          }}
          value={category}
        />
        <EmptyError
          errorText={STRINGS.CategoryCannotBeEmpty}
          formKey={form}
          value={category}
        />
        <CustomButton
          title={STRINGS.Add}
          onPress={async () => {
            setForm(true);
            if (category !== '') {
              dispatch(setLoading(true));
              if (
                type === 'expense'
                  ? expenseCats?.includes(category.toLowerCase())
                  : incomeCats?.includes(category.toLowerCase())
              ) {
                toast.error(`${category}${STRINGS.AlreadyAdded}`);
                dispatch(setLoading(false));
                return;
              }
              try {
                setModal(false);
                if (type === 'expense') {
                  dispatch(addExpenseCategory(category.toLowerCase()));
                  await updateDoc(doc(db, 'users', uid!), {
                    expenseCategory: [
                      ...expenseCats!,
                      category.toLowerCase(),
                    ].map((item) => encrypt(item, uid!)),
                  });
                } else if (type === 'income') {
                  dispatch(addIncomeCategory(category.toLowerCase()));
                  await updateDoc(doc(db, 'users', uid!), {
                    incomeCategory: [
                      ...incomeCats!,
                      category.toLowerCase(),
                    ].map((item) => encrypt(item, uid!)),
                  });
                }
                setMyCategory(category.toLocaleLowerCase().trim());
              } catch (e) {
                toast.error(e as string);
              } finally {
                setForm(false);
                setCategory('');
                dispatch(setLoading(false));
              }
            }
          }}
        />
      </div>
    </Modal>
  );
}

export default React.memo(CategoryModal);
