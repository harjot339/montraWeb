import React, { useState } from 'react';
import Modal from 'react-modal';
import ProgressBar from '@ramonak/react-progress-bar';
import { deleteField, doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ROUTES } from '../../Shared/Constants';
import ArrowLeft from '../../assets/svgs/arrow left black.svg';
import Trash from '../../assets/svgs/trash black.svg';
import Money from '../../assets/svgs/money-bag.svg';
import Alert from '../../assets/svgs/alert white.svg';
import { currencies, STRINGS } from '../../Shared/Strings';
import { catIcons, formatWithCommas } from '../../Utils/commonFuncs';
import { RootState } from '../../Store';
import { COLORS } from '../../Shared/commonStyles';
import CustomButton from '../../Components/CustomButton';
import { setLoading } from '../../Store/Loader';
import { db } from '../../Utils/firebaseConfig';
import CreateBudget from '../CreateBudget';

function BudgetDetail() {
  const navigate = useNavigate();
  const params = useParams();
  const month = params.id!.split('_')[0];
  const selectedCategory = params.id!.split('_')[1];
  const budgets = useSelector(
    (state: RootState) => state.common.user?.budget[month]
  );
  const spends = useSelector(
    (state: RootState) => state.common.user?.spend[month]
  );
  const uid = useSelector((state: RootState) => state.common.user?.uid);
  const conversion = useSelector((state: RootState) => state.common.conversion);
  const currency = useSelector(
    (state: RootState) => state.common.user?.currency
  );
  const budget = budgets?.[selectedCategory] ?? {
    alert: false,
    limit: 0,
    percentage: 0,
  };
  const spend = spends?.[selectedCategory] ?? 0;
  const [modal, setModal] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  return isOpen ? (
    <CreateBudget isEdit setIsOpen={setIsOpen} />
  ) : (
    <div
      className="flex-col rounded-lg flex w-full max-w-[420px] pb-5 bg-white justify-between sticky top-2 right-2"
      style={{ height: '95vh' }}
    >
      {' '}
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
      {budget && (
        <div className="flex flex-col justify-between h-full">
          <div className="flex-col flex">
            <div className="flex justify-between my-5 mx-4 items-center">
              <button
                type="button"
                className="outline-none bg-transparent"
                onClick={() => {
                  navigate(ROUTES.Budgets);
                }}
              >
                <img src={ArrowLeft} alt="" width="40px" />
              </button>
              <p className="text-black font-semibold text-xl">
                {STRINGS.DetailBudget}
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
            <div className="flex justify-center mt-10">
              <div className="flex border items-center px-5 py-3 gap-x-3 rounded-2xl">
                <div
                  className="h-10 min-w-10 rounded-lg "
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor:
                      catIcons[params.id!.split('_')[1]]?.color ??
                      COLORS.LIGHT[20],
                  }}
                >
                  <img
                    src={catIcons[params.id!.split('_')[1]]?.icon ?? Money}
                    alt=""
                    width="25px"
                  />
                </div>
                <p className="text-2xl font-semibold max-w-56 text-ellipsis overflow-hidden whitespace-nowrap">
                  {params.id!.split('_')[1][0].toUpperCase() +
                    params.id!.split('_')[1].slice(1)}
                </p>
              </div>
            </div>
            <p className="self-center text-5xl font-semibold mt-5">
              {STRINGS.Remaining}
            </p>
            <p className="self-center text-6xl font-semibold mt-5 mb-6">
              {currencies[currency!].symbol}
              {budget.limit - spend < 0 || spend === undefined
                ? '0'
                : formatWithCommas(
                    Number(
                      (
                        conversion.usd[currency!.toLowerCase()] *
                        (Number(budget.limit) - Number(spend))
                      ).toFixed(1)
                    ).toString()
                  )}
            </p>
            <div className="px-10">
              <ProgressBar
                completed={
                  spend / budget.limit > 1 ? 100 : (spend / budget.limit) * 100
                }
                isLabelVisible={false}
              />
            </div>
            {(spend ?? 0) >= budget.limit && (
              <div className="self-center flex items-center gap-x-3 bg-red-500 mt-16 px-6 py-3 rounded-3xl">
                <img src={Alert} width="30px" alt="" />
                <p className="text-white text-lg font-semibold">
                  {STRINGS.LimitExceeded}
                </p>
              </div>
            )}
          </div>
          <div className="flex px-6 mb-3">
            <CustomButton
              flex={1}
              title={STRINGS.Edit}
              onPress={() => {
                setIsOpen(true);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(BudgetDetail);
