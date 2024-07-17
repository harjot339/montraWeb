import React, {
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import ReactSwitch from 'react-switch';
import ReactSlider from 'react-slider';
import { toast } from 'react-toastify';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import clsx from 'clsx';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { COLORS } from '../../Shared/commonStyles';
import { STRINGS } from '../../Shared/Strings';
import ArrowLeft from '../../assets/svgs/arrow left.svg';
import ArrowLeftBlack from '../../assets/svgs/arrow left black.svg';
import { EmptyError, EmptyZeroError } from '../../Shared/errors';
import { formatWithCommas } from '../../Utils/commonFuncs';
import CustomButton from '../../Components/CustomButton';
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown';
import { RootState } from '../../Store';
import './styles.css';
import { setLoading } from '../../Store/Loader';
import { encrypt } from '../../Utils/encryption';
import { db } from '../../Utils/firebaseConfig';
import { handleOnlineNotify } from '../../Utils/firebaseFuncs';
import CategoryModal from '../../Components/CategoryModal';
import useAppTheme from '../../Hooks/themeHook';
import { useIsMobile, useIsTablet } from '../../Hooks/mobileCheckHook';
import MoneyInput from '../../Components/MoneyInput';

function CreateBudget({
  setIsOpen,
  isEdit,
}: Readonly<{
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
  isEdit: boolean;
}>) {
  // constants
  const params = useParams();
  // state
  const month = new Date().getMonth();
  const [amount, setAmount] = useState<string>('0');
  const [percentage, setPercentage] = useState<number>(0);
  const [cat, setCat] = useState<string>('');
  const [checked, setChecked] = useState<boolean>(false);
  const [form, setForm] = useState<boolean>(false);
  // redux
  const conversion = useSelector((state: RootState) => state.common.conversion);
  const currency = useSelector(
    (state: RootState) => state.common.user?.currency
  );
  const expenseCategory = useSelector(
    (state: RootState) => state.common.user?.expenseCategory
  );
  const budget = useSelector((state: RootState) => state.common.user?.budget);
  const budgets = budget?.[month];
  const spend = useSelector(
    (state: RootState) => state.common.user?.spend[month]
  );
  const uid = useSelector((state: RootState) => state.common.user?.uid);
  const dispatch = useDispatch();
  const dropdownData = useMemo(
    () =>
      expenseCategory!
        .filter((category) =>
          isEdit ? true : !Object.keys(budgets ?? []).includes(category)
        )
        .map((item) => {
          return {
            label:
              item === 'add'
                ? 'ADD NEW CATEGORY'
                : item[0].toUpperCase() + item.slice(1),
            value: item,
          };
        }),
    [expenseCategory, isEdit, budgets]
  );
  const handleCreate = useCallback(async () => {
    setForm(true);
    if (
      amount.replace(/,/g, '') !== '' &&
      Number(amount.replace(/,/g, '')) > 0 &&
      cat !== '' &&
      (checked === true ? percentage! > 0 : true)
    ) {
      try {
        dispatch(setLoading(true));
        await updateDoc(doc(db, 'users', uid!), {
          [`budget.${month}.${cat}`]: {
            limit: encrypt(
              String(
                (
                  Number(amount.replace(/,/g, '')) /
                  conversion.usd[currency!.toLowerCase()]
                ).toFixed(10)
              ),
              uid!
            ),
            alert: checked,
            percentage: encrypt(String(percentage), uid!),
          },
        });
        const curr = await getDoc(doc(db, 'users', uid!));
        const totalSpent = spend?.[cat!] ?? 0;
        await handleOnlineNotify({
          category: cat!,
          month,
          totalSpent,
          uid: uid!,
          curr,
        });

        toast.success(STRINGS.BudgetCreatedSuccesfully);
        dispatch(setLoading(false));
        setIsOpen(false);
        // navigation.pop();
      } catch (e) {
        toast.error(e as string);
        dispatch(setLoading(false));
      }
    }
  }, [
    amount,
    cat,
    checked,
    percentage,
    dispatch,
    uid,
    month,
    conversion.usd,
    currency,
    spend,
    setIsOpen,
  ]);
  useEffect(() => {
    if (isEdit) {
      const m = params.id?.split('_')[0];
      const c = params.id?.split('_')[1];
      setAmount(
        formatWithCommas(
          Number(
            (
              (conversion?.usd?.[currency?.toLowerCase() ?? 'usd'] ?? 1) *
              Number(budget![m!][c!].limit)
            ).toFixed(2)
          ).toString()
        )
      );
      setPercentage(budget![m!][c!].percentage);
      setCat(c!);
      setChecked(budget![m!][c!].alert);
    }
  }, [budget, conversion?.usd, currency, isEdit, params]);
  const [addCategoryModal, setAddCategoryModal] = useState<boolean>(false);
  const [theme] = useAppTheme();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  return (
    <div
      className={clsx(
        'flex flex-col rounded-lg w-full justify-between',
        !isMobile && !isTablet && 'max-w-[450px]'
      )}
      style={{
        backgroundColor: COLORS.VIOLET[100],
        // minWidth: '28vw',
        height: isMobile || isTablet ? '100vh' : '95vh',
      }}
    >
      <CategoryModal
        modal={addCategoryModal}
        setModal={setAddCategoryModal}
        setMyCategory={setCat}
        type="expense"
      />
      <div className="flex justify-between px-6 pt-4 items-center">
        <button
          type="button"
          className="bg-transparent outline-none"
          onClick={() => {
            setIsOpen(false);
          }}
        >
          {theme === 'dark' ? (
            <img src={ArrowLeftBlack} alt="" width="40px" />
          ) : (
            <img src={ArrowLeft} alt="" width="40px" />
          )}
        </button>
        <p
          className={clsx(
            'text-3xl font-semibold',
            theme === 'dark' ? 'text-black' : 'text-white'
          )}
        >
          {STRINGS.CreateBudget}
        </p>
        <div className="w-10" />
      </div>
      <div>
        <p
          className={clsx(
            'text-5xl px-4 sm:px-8 opacity-80 font-semibold',
            theme === 'dark' ? 'text-black' : 'text-white'
          )}
        >
          {STRINGS.HowMuch}
        </p>
        <MoneyInput amount={amount} setAmount={setAmount} theme={theme} />
        <EmptyZeroError
          value={amount}
          errorText={STRINGS.PleaseFillAnAmount}
          formKey={form}
        />
        <div
          className={clsx(
            'px-4 sm:px-8 py-8 rounded-t-2xl rounded-b-lg flex flex-col',
            theme === 'dark' ? 'bg-black' : 'bg-white'
          )}
        >
          <CustomDropdown
            placeholder={STRINGS.Category}
            data={dropdownData}
            onChange={(e) => {
              if (e!.value === 'add') {
                setAddCategoryModal(true);
              } else {
                setCat(e!.value as string);
              }
            }}
            value={
              cat
                ? {
                    label: cat[0].toUpperCase() + cat.slice(1),
                    value: cat,
                  }
                : undefined
            }
          />
          <EmptyError
            errorText={STRINGS.PleaseSelectACategory}
            formKey={form}
            value={cat}
          />

          <div
            className={clsx(
              'flex justify-between items-center',
              theme === 'dark' ? 'text-white' : 'text-black'
            )}
          >
            <div>
              <p className="text-2xl font-semibold">{STRINGS.RecieveAlert}</p>
              <p>
                {STRINGS.RecieveAlertWhen} {'\n'}
                {STRINGS.SomePoint}
              </p>
            </div>
            <ReactSwitch
              checked={checked}
              onChange={(c) => {
                setChecked(c);
              }}
              checkedIcon={false}
              uncheckedIcon={false}
              onColor={COLORS.VIOLET[100]}
              offColor={COLORS.VIOLET[20]}
            />
          </div>
          <div className="my-2.5" />
          {checked && (
            <ReactSlider
              className="horizontal-slider"
              thumbClassName="thumb"
              value={percentage}
              onChange={(val) => {
                setPercentage(val);
              }}
              renderThumb={(props, state) => (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <div {...props}>{state.valueNow}%</div>
              )}
            />
          )}

          <div className="my-6" />
          <CustomButton title={STRINGS.Continue} onPress={handleCreate} />
        </div>
      </div>
    </div>
  );
}

export default React.memo(CreateBudget);
