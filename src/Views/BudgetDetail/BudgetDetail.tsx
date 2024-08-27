import React, { useState } from 'react';
// Third Party Libraries
import ProgressBar from '@ramonak/react-progress-bar';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
// Custom Components
import CustomButton from '../../Components/CustomButton';
import CreateBudget from '../CreateBudget';
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
import DeleteBudgetModal from '../../Components/DeleteBudgetModal/DeleteBudgetModal';
import useAppTheme from '../../Hooks/themeHook';
import { useIsMobile, useIsTablet } from '../../Hooks/mobileCheckHook';
import { convertCatLang } from '../../localization';

function BudgetDetail() {
  // constants
  const navigate = useNavigate();
  const params = useParams();
  const month = params.id!.split('_')[0];
  const selectedCategory = params.id!.split('_')[1];
  const [theme] = useAppTheme();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  // redux
  const budgets = useSelector(
    (state: RootState) => state.common.user?.budget[month]
  );
  const spends = useSelector(
    (state: RootState) => state.common.user?.spend[month]
  );
  const expenseColors = useSelector(
    (state: RootState) => state.common.user?.expenseColors
  );
  const uid = useSelector((state: RootState) => state.common.user?.uid);
  const currency = useSelector(
    (state: RootState) => state.common.user?.currency
  );
  const budget = budgets?.[selectedCategory];
  // state
  const [modal, setModal] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
        height: isMobile || isTablet ? '100dvh' : '95vh',
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
                  {convertCatLang(STRINGS, params.id!.split('_')[1])}
                </p>
              </div>
            </div>
            <p
              className={clsx(
                'self-center text-[40px] font-semibold mt-5',
                theme === 'dark' && 'text-white'
              )}
            >
              {STRINGS.Remaining}
            </p>
            <p
              className={clsx(
                'self-center text-center text-[40px] font-semibold mt-5 mb-6 max-w-[90%] text-ellipsis overflow-hidden whitespace-nowrap',
                theme === 'dark' && 'text-white'
              )}
            >
              {currencies[currency!].symbol}
              {budget.limit - (spends?.[selectedCategory]?.USD ?? 0) < 0
                ? '0'
                : formatWithCommas(
                    (
                      budget.conversion.usd[currency?.toLowerCase() ?? 'usd'] *
                        Number(budget.limit) -
                      Number(
                        spends?.[selectedCategory]?.[
                          currency?.toUpperCase() ?? 'USD'
                        ] ?? 0
                      )
                    )
                      .toFixed(2)
                      .toString()
                  )}
            </p>
            <div className="px-10">
              <ProgressBar
                completed={
                  (spends?.[selectedCategory]?.USD ?? 0) / budget.limit > 1
                    ? 100
                    : ((spends?.[selectedCategory]?.USD ?? 0) / budget.limit) *
                      100
                }
                bgColor={expenseColors?.[selectedCategory] ?? 'green'}
                isLabelVisible={false}
              />
            </div>
            {(spends?.[selectedCategory]?.USD ?? 0) >= budget.limit && (
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
