import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { COLORS } from '../../Shared/commonStyles';
import { RootState } from '../../Store';
import { currencies, monthData, STRINGS, weekData } from '../../Shared/Strings';
import ArrowLeft from '../../assets/svgs/arrow left.svg';
import Trash from '../../assets/svgs/trash.svg';
import { formatWithCommas } from '../../Utils/commonFuncs';
import { ROUTES } from '../../Shared/Constants';
import CustomButton from '../../Components/CustomButton';
import AddExpense from '../AddExpense/AddExpense';
import { db } from '../../Utils/firebaseConfig';
import { setLoading } from '../../Store/Loader';

function TransactionDetail() {
  const data = useSelector(
    (state: RootState) => state.transactions.transactions
  );
  const conversion = useSelector((state: RootState) => state.common.conversion);
  const currency = useSelector(
    (state: RootState) => state.common.user?.currency
  );
  const uid = useSelector((state: RootState) => state.common.user?.uid);
  const dispatch = useDispatch();
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
            ).toFixed(1)
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
          ).toFixed(1)
        ).toString()
      );
    },
    [conversion?.usd, currency]
  );
  return isOpen ? (
    <AddExpense
      height="95vh"
      isEdit
      pageType={transaction!.type}
      setIsOpen={setIsOpen}
      prevTransaction={transaction}
    />
  ) : (
    transaction && (
      <div
        className="flex-col rounded-lg flex w-full max-w-[420px] pb-5 bg-white justify-between sticky top-2 right-2"
        style={{ height: '95vh' }}
      >
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
            },
            overlay: {
              backgroundColor: '#00000050',
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
        <div>
          <div
            className="flex-col rounded-t-lg rounded-b-3xl flex border"
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
                <img src={ArrowLeft} alt="" width="40px" />
              </button>
              <p className="text-white font-semibold text-xl">
                {STRINGS.DetailTransaction}
              </p>
              <button
                type="button"
                className="outline-none bg-transparent"
                onClick={() => {
                  setModal(true);
                }}
              >
                <img src={Trash} alt="" width="40px" />
              </button>
            </div>
            <div className="self-center items-center flex flex-col">
              <p className="text-5xl text-white font-bold mb-4">
                {currencies[currency!].symbol ?? '$'}{' '}
                {currencyConvert(transaction!.amount)}
              </p>
              <p className="text-lg text-white font-semibold mb-2 text-ellipsis overflow-hidden whitespace-nowrap max-w-80">
                {transaction?.desc}
              </p>
              <p className="text-md text-white font-normal mb-16">
                {
                  weekData[
                    Timestamp.fromMillis(transaction!.timeStamp.seconds * 1000)
                      .toDate()
                      .getDay()
                  ].label
                }{' '}
                {Timestamp.fromMillis(transaction!.timeStamp.seconds * 1000)
                  .toDate()
                  .getDate()}{' '}
                {
                  monthData[
                    Timestamp.fromMillis(transaction!.timeStamp.seconds * 1000)
                      .toDate()
                      .getMonth()
                  ].label
                }{' '}
                {Timestamp.fromMillis(transaction!.timeStamp.seconds * 1000)
                  .toDate()
                  .getFullYear()}{' '}
                {Timestamp.fromMillis(transaction!.timeStamp.seconds * 1000)
                  .toDate()
                  .getHours()}
                :
                {Timestamp.fromMillis(transaction!.timeStamp.seconds * 1000)
                  .toDate()
                  .getMinutes()}
              </p>
            </div>
          </div>
          <div>
            <div className="-translate-y-11">
              <div className="flex bg-white w-5/6 border  justify-between mx-auto px-8 py-4 rounded-xl">
                <div className=" text-center">
                  <p className="text-xl font-semibold">{STRINGS.Type}</p>
                  <p>
                    {transaction!.type[0].toUpperCase() +
                      transaction!.type.slice(1)}
                  </p>
                </div>
                <div className=" text-center">
                  <p className="text-xl font-semibold">
                    {transaction?.type === 'transfer'
                      ? STRINGS.From
                      : STRINGS.Category}
                  </p>
                  <p>
                    {transaction?.type === 'transfer'
                      ? transaction!.from[0].toUpperCase() +
                        transaction!.from.slice(1)
                      : transaction!.category[0].toUpperCase() +
                        transaction!.category.slice(1)}
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
                      ? transaction!.to[0].toUpperCase() +
                        transaction!.to.slice(1)
                      : transaction!.category[0].toUpperCase() +
                        transaction!.category.slice(1)}
                  </p>
                </div>
              </div>
              <div className="px-5 pt-6">
                {transaction?.desc !== '' && (
                  <>
                    <p className="text-2xl font-semibold text-gray-500 ">
                      {STRINGS.Description}
                    </p>
                    <p className="text-lg mt-3">{transaction?.desc}</p>
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
