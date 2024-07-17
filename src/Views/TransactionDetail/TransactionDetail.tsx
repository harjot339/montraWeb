import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { Timestamp } from 'firebase/firestore';
import { COLORS } from '../../Shared/commonStyles';
import { RootState } from '../../Store';
import { currencies, monthData, STRINGS, weekData } from '../../Shared/Strings';
import ArrowLeft from '../../assets/svgs/arrow left.svg';
import ArrowLeftBlack from '../../assets/svgs/arrow left black.svg';
import Trash from '../../assets/svgs/trash.svg';
import TrashBlack from '../../assets/svgs/trash black.svg';
import { formatWithCommas } from '../../Utils/commonFuncs';
import { ROUTES } from '../../Shared/Constants';
import CustomButton from '../../Components/CustomButton';
import AddExpense from '../AddExpense/AddExpense';
import useAppTheme from '../../Hooks/themeHook';
import { useIsMobile, useIsTablet } from '../../Hooks/mobileCheckHook';
import DeleteTransactionModal from '../../Components/DeleteTransactionModal';

function TransactionDetail() {
  const data = useSelector(
    (state: RootState) => state.transactions.transactions
  );
  const conversion = useSelector((state: RootState) => state.common.conversion);
  const currency = useSelector(
    (state: RootState) => state.common.user?.currency
  );
  const uid = useSelector((state: RootState) => state.common.user?.uid);
  const params = useParams();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const navigate = useNavigate();
  const transaction = data.find((item) => item.id === params.id);
  const getBackgroundColor = useMemo(() => {
    if (transaction?.type === 'expense') {
      return COLORS.PRIMARY.RED;
    }
    if (transaction?.type === 'transfer') {
      return COLORS.PRIMARY.BLUE;
    }
    return COLORS.PRIMARY.GREEN;
  }, [transaction]);
  const currencyConvert = useCallback(
    (amount: number) => {
      if (
        Number.isNaN(
          Number(
            (
              (conversion?.usd?.[currency?.toLowerCase() ?? 'usd'] ?? 1) *
              amount
            ).toFixed(2)
          )
        )
      ) {
        return 0;
      }
      return formatWithCommas(
        Number(
          (
            (conversion?.usd?.[currency?.toLowerCase() ?? 'usd'] ?? 1) *
            Number(amount)
          ).toFixed(2)
        ).toString()
      );
    },
    [conversion?.usd, currency]
  );
  const [theme] = useAppTheme();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  return isOpen ? (
    <AddExpense
      height={isMobile || isTablet ? '100vh' : '95vh'}
      isEdit
      pageType={transaction!.type}
      setIsOpen={setIsOpen}
      prevTransaction={transaction}
    />
  ) : (
    transaction && (
      <div
        className={clsx(
          'flex-col rounded-lg flex w-full pb-5 justify-between sticky top-0',
          theme === 'dark' ? 'bg-black' : 'bg-white',
          !isMobile && !isTablet && 'max-w-[450px]'
        )}
        style={{ height: isMobile || isTablet ? '100vh' : '95vh' }}
      >
        <DeleteTransactionModal
          modal={modal}
          setModal={setModal}
          transaction={transaction}
          uid={uid}
        />
        <div>
          <div
            className={clsx(
              'flex-col rounded-t-lg rounded-b-3xl flex',
              theme === 'dark' ? 'text-black' : 'text-white'
            )}
            style={{ backgroundColor: getBackgroundColor }}
          >
            <div className="flex justify-between my-5 mx-4 items-center">
              <button
                type="button"
                className="outline-none bg-transparent"
                onClick={() => {
                  navigate(ROUTES.Transactions);
                }}
              >
                {theme === 'dark' ? (
                  <img src={ArrowLeftBlack} alt="" width="40px" />
                ) : (
                  <img src={ArrowLeft} alt="" width="40px" />
                )}
              </button>
              <p className="font-semibold text-xl">
                {STRINGS.DetailTransaction}
              </p>
              <button
                type="button"
                className="outline-none bg-transparent"
                onClick={() => {
                  setModal(true);
                }}
              >
                {theme === 'dark' ? (
                  <img src={TrashBlack} alt="" width="40px" />
                ) : (
                  <img src={Trash} alt="" width="40px" />
                )}
              </button>
            </div>
            <div className="self-center items-center flex flex-col">
              <p className="text-5xl  font-bold mb-4">
                {currencies[currency!].symbol ?? '$'}{' '}
                {currencyConvert(transaction.amount)}
              </p>
              <p className="text-lg  font-semibold mb-2 text-ellipsis overflow-hidden whitespace-nowrap max-w-80">
                {transaction?.desc}
              </p>
              <p className="text-md  font-normal mb-16">
                {
                  weekData[
                    Timestamp.fromMillis(transaction.timeStamp.seconds * 1000)
                      .toDate()
                      .getDay()
                  ].label
                }{' '}
                {Timestamp.fromMillis(transaction.timeStamp.seconds * 1000)
                  .toDate()
                  .getDate()}{' '}
                {
                  monthData[
                    Timestamp.fromMillis(transaction.timeStamp.seconds * 1000)
                      .toDate()
                      .getMonth()
                  ].label
                }{' '}
                {Timestamp.fromMillis(transaction.timeStamp.seconds * 1000)
                  .toDate()
                  .getFullYear()}{' '}
                {Timestamp.fromMillis(transaction.timeStamp.seconds * 1000)
                  .toDate()
                  .getHours()}
                :
                {Timestamp.fromMillis(transaction.timeStamp.seconds * 1000)
                  .toDate()
                  .getMinutes()}
              </p>
            </div>
          </div>
          <div>
            <div className="-translate-y-11">
              <div
                className={clsx(
                  'flex w-5/6 border  justify-between mx-auto px-8 py-4 rounded-xl',
                  theme === 'dark' ? 'bg-black text-white' : 'bg-white'
                )}
              >
                <div className="text-center">
                  <p className="text-xl font-semibold">{STRINGS.Type}</p>
                  <p>
                    {transaction.type[0].toUpperCase() +
                      transaction.type.slice(1)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-semibold">
                    {transaction?.type === 'transfer'
                      ? STRINGS.From
                      : STRINGS.Category}
                  </p>
                  <p>
                    {transaction?.type === 'transfer'
                      ? transaction.from[0].toUpperCase() +
                        transaction.from.slice(1)
                      : transaction.category[0].toUpperCase() +
                        transaction.category.slice(1)}
                  </p>
                </div>
                <div className=" text-center">
                  <p className="text-xl font-semibold">
                    {transaction?.type === 'transfer'
                      ? STRINGS.To
                      : STRINGS.Wallet}
                  </p>
                  <p>
                    {transaction?.type === 'transfer'
                      ? transaction.to[0].toUpperCase() +
                        transaction.to.slice(1)
                      : transaction.category[0].toUpperCase() +
                        transaction.category.slice(1)}
                  </p>
                </div>
              </div>
              <div className="px-5 pt-6">
                {transaction?.desc !== '' && (
                  <>
                    <p className="text-2xl font-semibold text-gray-500 ">
                      {STRINGS.Description}
                    </p>
                    <p
                      className={clsx(
                        'text-lg mt-3',
                        theme === 'dark' && 'text-white'
                      )}
                    >
                      {transaction?.desc}
                    </p>
                  </>
                )}
                {transaction?.attachementType !== 'none' && (
                  <>
                    <p className="text-2xl font-semibold mt-8 text-gray-500">
                      {STRINGS.Attachement}
                    </p>
                    {transaction?.attachementType === 'image' ? (
                      <img
                        src={transaction.attachement}
                        alt=""
                        style={{
                          height: '300px',
                          overflow: 'hidden',
                        }}
                      />
                    ) : (
                      <a
                        className="flex mt-4"
                        href={transaction?.attachement}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <CustomButton
                          backgroundColor={COLORS.VIOLET[20]}
                          textColor={COLORS.VIOLET[100]}
                          flex={1}
                          title={STRINGS.ViewDocument}
                          onPress={() => {}}
                        />
                      </a>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 flex">
          <CustomButton
            title={STRINGS.Edit}
            flex={1}
            onPress={() => {
              setIsOpen(true);
            }}
          />
        </div>
      </div>
    )
  );
}

export default React.memo(TransactionDetail);
