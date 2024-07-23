import React, { useCallback, useEffect, useMemo, useState } from 'react';
// Third Party Libraries
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import ReactSwitch from 'react-switch';
import { Timestamp } from 'firebase/firestore';
// Custom Components
import CustomButton from '../../Components/CustomButton';
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown';
import CustomInput from '../../Components/CustomInput';
import AttachmentCtr from './atoms/AttachmentCtr';
import RepeatDataModal from './atoms/RepeatDataModal';
import CategoryModal from '../../Components/CategoryModal';
import MoneyInput from '../../Components/MoneyInput';
import {
  EmptyZeroError,
  EmptyError,
  CompundEmptyError,
} from '../../Shared/errors';
import { monthData, STRINGS, weekData } from '../../Shared/Strings';
import { RootState } from '../../Store';
import { formatWithCommas } from '../../Utils/commonFuncs';
import { COLORS, InputBorderColor } from '../../Shared/commonStyles';
import { RepeatDataType, TransactionType } from '../../Defs/transaction';
import ArrowLeft from '../../assets/svgs/arrow left.svg';
import ArrowLeftBlack from '../../assets/svgs/arrow left black.svg';
import { setLoading } from '../../Store/Loader';
import { handleOnline } from '../../Utils/firebaseFuncs';
import useAppTheme from '../../Hooks/themeHook';
import { useIsMobile, useIsTablet } from '../../Hooks/mobileCheckHook';
import Transfer from '../../assets/svgs/transfer.svg';

function AddExpense({
  setIsOpen,
  pageType,
  isEdit,
  prevTransaction,
  height,
}: Readonly<{
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  pageType: 'income' | 'expense' | 'transfer';
  isEdit: boolean;
  prevTransaction?: TransactionType;
  height?: string;
}>) {
  // redux
  const expenseCategory = useSelector(
    (state: RootState) => state.common.user?.expenseCategory
  );
  const incomeCategory = useSelector(
    (state: RootState) => state.common.user?.incomeCategory
  );
  const user = useSelector((state: RootState) => state.common.user);
  const conversion = useSelector((state: RootState) => state.common.conversion);
  const dispatch = useDispatch();
  // constants
  const month = new Date().getMonth();
  const [theme, COLOR] = useAppTheme();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  // state
  const [cat, setCat] = useState<string>('');
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [wallet, setWallet] = useState<string>('');
  const [desc, setDesc] = useState<string>('');
  const [amount, setAmount] = useState<string>('0');
  const [form, setForm] = useState<boolean>(false);
  const [file, setFile] = useState<{
    file: File | undefined;
    type: TransactionType['attachementType'];
  }>({ file: undefined, type: 'none' });
  const [repeatData, setRepeatData] = useState<RepeatDataType | undefined>(
    undefined
  );
  const [img, setImg] = useState<File | undefined>(undefined);
  const [checked, setChecked] = useState(false);
  const [modal, setModal] = useState<boolean>(false);
  const [addCategoryModal, setAddCategoryModal] = useState<boolean>(false);
  // functions
  const getBackgroundColor = useMemo(() => {
    if (pageType === 'expense') {
      return COLORS.PRIMARY.RED;
    }
    if (pageType === 'transfer') {
      return COLORS.PRIMARY.BLUE;
    }
    return COLORS.PRIMARY.GREEN;
  }, [pageType]);

  const handlePress = useCallback(async () => {
    setForm(true);
    if (
      pageType === 'transfer' &&
      (amount.replace(/,/g, '').trim() === '' ||
        amount.replace(/,/g, '').trim() === '.' ||
        Number(amount.replace(/,/g, '')) <= 0 ||
        from === '' ||
        to === '')
    ) {
      return;
    }
    if (
      pageType !== 'transfer' &&
      (amount.replace(/,/g, '').trim() === '' ||
        amount.replace(/,/g, '').trim() === '.' ||
        Number(amount.replace(/,/g, '')) <= 0 ||
        cat === '' ||
        wallet === '')
    ) {
      return;
    }
    dispatch(setLoading(true));
    try {
      const id = uuidv4();
      await handleOnline({
        attachement: file.file,
        attachementType: file.type,
        id,
        amount,
        category: cat,
        conversion,
        currency: user?.currency,
        desc,
        from,
        isEdit,
        month,
        pageType,
        prevTransaction,
        repeatData,
        to,
        uid: user!.uid,
        wallet,
      });
      setIsOpen(false);
    } catch (e) {
      toast.error(e as string);
      toast.clearWaitingQueue();
      //   console.log(e)
    } finally {
      dispatch(setLoading(false));
    }
  }, [
    amount,
    cat,
    conversion,
    desc,
    dispatch,
    file.file,
    file.type,
    from,
    isEdit,
    month,
    pageType,
    prevTransaction,
    repeatData,
    setIsOpen,
    to,
    user,
    wallet,
  ]);
  const getDate = useCallback(() => {
    if (repeatData) {
      if (isEdit) {
        if ((repeatData.date as Timestamp)?.seconds !== undefined) {
          return `${Timestamp.fromMillis(
            (repeatData.date as Timestamp).seconds * 1000
          )
            ?.toDate()
            ?.getDate()} ${
            monthData[
              Timestamp.fromMillis(
                (repeatData.date as Timestamp).seconds * 1000
              )
                ?.toDate()
                ?.getMonth()
            ].label
          } ${Timestamp.fromMillis(
            (repeatData.date as Timestamp).seconds * 1000
          )
            ?.toDate()
            ?.getFullYear()}`;
        }
        return `${(repeatData.date as Date)?.getDate()} ${
          monthData[(repeatData.date as Date)?.getMonth()].label
        } ${(repeatData.date as Date)?.getFullYear()}`;
      }
      return `${(repeatData.date as Date)?.getDate()} ${
        monthData[(repeatData.date as Date)?.getMonth()].label
      } ${(repeatData.date as Date)?.getFullYear()}`;
    }
    return '';
  }, [isEdit, repeatData]);
  useEffect(() => {
    if (isEdit) {
      setAmount(
        formatWithCommas(
          Number(
            (
              (conversion?.usd?.[user?.currency?.toLowerCase() ?? 'usd'] ?? 1) *
              Number(prevTransaction?.amount)
            ).toFixed(2)
          ).toString()
        )
      );
      setCat(prevTransaction!.category);
      setDesc(prevTransaction!.desc);
      setWallet(prevTransaction!.wallet);
      setRepeatData(
        prevTransaction?.freq === null ? undefined : prevTransaction?.freq
      );
      setChecked(prevTransaction?.freq !== null);
      setFrom(prevTransaction!.from);
      setTo(prevTransaction!.to);
    }
  }, [conversion?.usd, isEdit, prevTransaction, user?.currency]);
  return (
    <div
      className={clsx(
        'flex flex-col rounded-lg h-screen justify-between w-full',
        !isMobile && !isTablet && 'max-w-[450px]'
      )}
      style={{ backgroundColor: getBackgroundColor, height }}
    >
      <RepeatDataModal
        modal={modal}
        setModal={setModal}
        setChecked={setChecked}
        setRepeatData={setRepeatData}
        repeatData={repeatData}
      />
      <CategoryModal
        modal={addCategoryModal}
        setModal={setAddCategoryModal}
        setMyCategory={setCat}
        type={pageType}
      />
      <div className="flex justify-between px-4 sm:px-8 pt-4 items-center">
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
          {pageType[0].toUpperCase() + pageType.slice(1)}
        </p>
        <div className="w-10" />
      </div>
      <div>
        <div className="min-h-32" />
        <p
          className={clsx(
            'text-4xl px-4 sm:px-8 opacity-80 font-semibold',
            theme === 'dark' ? 'text-black' : 'text-white'
          )}
        >
          {STRINGS.HowMuch}
        </p>
        <MoneyInput
          amount={amount}
          setAmount={setAmount}
          theme={theme}
          currency={user?.currency}
        />
        <EmptyZeroError
          value={amount}
          errorText={STRINGS.PleaseFillAnAmount}
          formKey={form}
        />
        <div
          className={clsx(
            'px-4 sm:px-8 py-8 rounded-t-2xl flex flex-col',
            theme === 'dark' ? 'bg-black' : 'bg-white'
          )}
        >
          {pageType !== 'transfer' ? (
            <>
              <CustomDropdown
                borderColor={InputBorderColor}
                placeholder={STRINGS.Category}
                data={(pageType === 'expense'
                  ? expenseCategory
                  : incomeCategory)!.map((item) => {
                  return { label: item, value: item };
                })}
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
                        value: cat,
                        label: cat[0].toUpperCase() + cat.slice(1),
                      }
                    : undefined
                }
              />
              <EmptyError
                errorText={STRINGS.PleaseSelectACategory}
                formKey={form}
                value={cat}
              />
            </>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <input
                  className="w-[45%] inline border-b border-r border-l border-t rounded-lg bg-transparent border-[#F1F1FA] px-3 h-12 md:h-14 outline-none hover:border-gray-400 mr-1"
                  placeholder={STRINGS.From}
                  value={from}
                  onChange={(e) => {
                    setFrom(e.target.value);
                  }}
                  style={{ color: COLOR.DARK[100] }}
                  maxLength={20}
                />
                <img src={Transfer} alt="" width="28px" />
                <input
                  className="w-[45%] inline border-b border-r border-l border-t rounded-lg bg-transparent border-[#F1F1FA] px-3 h-12 md:h-14 outline-none hover:border-gray-400 ml-1"
                  placeholder={STRINGS.To}
                  onChange={(e) => {
                    setTo(e.target.value);
                  }}
                  value={to}
                  style={{ color: COLOR.DARK[100] }}
                  maxLength={20}
                />
              </div>
              <CompundEmptyError
                errorText={STRINGS.PleaseFillBothFields}
                formKey={form}
                value1={from}
                value2={to}
              />
            </>
          )}
          <CustomInput
            inputColor={COLOR.DARK[100]}
            placeholderText={STRINGS.Description}
            onChange={(e) => {
              setDesc(e.target.value);
            }}
            value={desc}
          />
          <div className="my-2.5" />
          {pageType !== 'transfer' && (
            <>
              <CustomDropdown
                borderColor={InputBorderColor}
                placeholder={STRINGS.Wallet}
                data={[
                  { label: 'Paypal', value: 'paypal' },
                  { label: 'Chase', value: 'chase' },
                ]}
                onChange={(e) => {
                  setWallet(e!.value as string);
                }}
                value={
                  wallet
                    ? {
                        value: wallet,
                        label: wallet[0].toUpperCase() + wallet.slice(1),
                      }
                    : undefined
                }
              />
              <EmptyError
                errorText={STRINGS.PleaseSelectAWallet}
                formKey={form}
                value={wallet}
              />
            </>
          )}
          <AttachmentCtr
            img={img}
            setImg={setImg}
            setFile={setFile}
            isEdit={isEdit}
            attachement={prevTransaction?.attachement}
            attachementType={prevTransaction?.attachementType}
          />
          <div className="my-2.5" />
          {pageType !== 'transfer' && (
            <>
              <div
                className={clsx(
                  'flex justify-between items-center',
                  theme === 'dark' && 'text-white'
                )}
              >
                <div>
                  <p className="text-2xl font-semibold">{STRINGS.Repeat}</p>
                  <p>{STRINGS.RepeatTransaction}</p>
                </div>
                <ReactSwitch
                  checked={checked}
                  onChange={(c) => {
                    setChecked(c);
                    if (c) {
                      setModal(true);
                    } else if (repeatData !== undefined) {
                      // eslint-disable-next-line no-alert
                      const res = window.confirm(
                        STRINGS.ClearRepeatTransaction
                      );
                      if (res) {
                        setRepeatData(undefined);
                      } else {
                        setChecked(true);
                      }
                    }
                  }}
                  checkedIcon={false}
                  uncheckedIcon={false}
                  onColor={COLORS.VIOLET[100]}
                  offColor={COLORS.VIOLET[20]}
                  boxShadow="0"
                  activeBoxShadow="0"
                />
              </div>
              <div className="my-2.5" />
            </>
          )}
          {repeatData && (
            <div
              className={clsx(
                'flex justify-between items-center',
                theme === 'dark' && 'text-white'
              )}
            >
              <div>
                <p className="text-xl font-semibold">{STRINGS.Frequency}</p>
                <p>
                  {repeatData.freq[0].toUpperCase() + repeatData.freq.slice(1)}
                  {repeatData.freq !== 'daily' && ' - '}
                  {repeatData.freq === 'yearly' &&
                    monthData[repeatData.month! - 1].label}{' '}
                  {(repeatData.freq === 'yearly' ||
                    repeatData.freq === 'monthly') &&
                    repeatData.day}
                  {repeatData.freq === 'weekly' &&
                    weekData[repeatData.weekDay].label}
                </p>
              </div>
              {repeatData.end !== 'never' ? (
                <div>
                  <p className="text-xl font-semibold">{STRINGS.EndAfter}</p>
                  <p>{getDate()}</p>
                </div>
              ) : (
                <div />
              )}
              <button
                type="button"
                className="rounded-2xl px-4 h-8 text-sm sm:text-base font-semibold"
                style={{
                  backgroundColor: COLORS.VIOLET[20],
                  color: COLORS.VIOLET[100],
                }}
                onClick={() => {
                  setModal(true);
                }}
              >
                {STRINGS.Edit}
              </button>
            </div>
          )}
          <div className="my-2.5" />
          <CustomButton title={STRINGS.Continue} onPress={handlePress} />
        </div>
      </div>
    </div>
  );
}

export default React.memo(AddExpense);
