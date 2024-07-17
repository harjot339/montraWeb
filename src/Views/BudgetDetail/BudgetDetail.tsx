import React, { useState } from 'react';
import ProgressBar from '@ramonak/react-progress-bar';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { ROUTES } from '../../Shared/Constants';
import ArrowLeftBlack from '../../assets/svgs/arrow left black.svg';
import ArrowLeft from '../../assets/svgs/arrow left.svg';
import TrashBlack from '../../assets/svgs/trash black.svg';
import Trash from '../../assets/svgs/trash.svg';
import Money from '../../assets/svgs/money-bag.svg';
import Alert from '../../assets/svgs/alert white.svg';
import { currencies, STRINGS } from '../../Shared/Strings';
import { catIcons, formatWithCommas } from '../../Utils/commonFuncs';
import { RootState } from '../../Store';
import { COLORS } from '../../Shared/commonStyles';
import CustomButton from '../../Components/CustomButton';
import CreateBudget from '../CreateBudget';
import DeleteBudgetModal from '../../Components/DeleteBudgetModal/DeleteBudgetModal';
import useAppTheme from '../../Hooks/themeHook';
import { useIsMobile, useIsTablet } from '../../Hooks/mobileCheckHook';

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
  const [theme] = useAppTheme();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  return isOpen ? (
    <CreateBudget isEdit setIsOpen={setIsOpen} />
  ) : (
    <div
      className={clsx(
        'flex-col rounded-lg flex w-full  pb-5 justify-between sticky top-2 right-2',
        theme === 'dark' ? 'bg-black' : 'bg-white',
        !isMobile && !isTablet && 'max-w-[450px]'
      )}
      style={{
        height: isMobile || isTablet ? '100vh' : '95vh',
        // maxWidth: isMobile || isTablet ? '100%' : '450px',
      }}
    >
      <DeleteBudgetModal
        modal={modal}
        setModal={setModal}
        month={Number(month)}
        selectedCategory={selectedCategory}
        uid={uid}
      />
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
                {theme === 'dark' ? (
                  <img src={ArrowLeft} alt="" width="40px" />
                ) : (
                  <img src={ArrowLeftBlack} alt="" width="40px" />
                )}
              </button>
              <p
                className={clsx(
                  'font-semibold text-xl',
                  theme === 'dark' ? 'text-white' : 'text-black'
                )}
              >
                {STRINGS.DetailBudget}
              </p>
              <button
                type="button"
                className="outline-none bg-transparent"
                onClick={() => {
                  setModal(true);
                }}
              >
                {theme === 'dark' ? (
                  <img src={Trash} alt="" width="40px" />
                ) : (
                  <img src={TrashBlack} alt="" width="40px" />
                )}
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
                <p
                  className={clsx(
                    'text-2xl font-semibold max-w-56 text-ellipsis overflow-hidden whitespace-nowrap',
                    theme === 'dark' && 'text-white'
                  )}
                >
                  {params.id!.split('_')[1][0].toUpperCase() +
                    params.id!.split('_')[1].slice(1)}
                </p>
              </div>
            </div>
            <p
              className={clsx(
                'self-center text-5xl font-semibold mt-5',
                theme === 'dark' && 'text-white'
              )}
            >
              {STRINGS.Remaining}
            </p>
            <p
              className={clsx(
                'self-center text-6xl font-semibold mt-5 mb-6',
                theme === 'dark' && 'text-white'
              )}
            >
              {currencies[currency!].symbol}
              {budget.limit - spend < 0 || spend === undefined
                ? '0'
                : formatWithCommas(
                    Number(
                      (
                        conversion.usd[currency!.toLowerCase()] *
                        (Number(budget.limit) - Number(spend))
                      ).toFixed(2)
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
