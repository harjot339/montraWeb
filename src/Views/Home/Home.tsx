import React, { useState } from 'react';
import clsx from 'clsx';
// Third Party Libraries
import { useSelector } from 'react-redux';
// Custom Components
import Graph from './atoms/Graph';
import Income from '../../assets/svgs/income.svg';
import Expense from '../../assets/svgs/expense.svg';
import Transfer from '../../assets/svgs/currency-exchange.svg';
import BudgetSection from './atoms/BudgetSection';
import RecentSection from './atoms/RecentSection';
import OverviewSection from './atoms/OverviewSection';
import AddExpense from '../AddExpense/AddExpense';
import Header from './atoms/Header';
import useAppTheme from '../../Hooks/themeHook';
import { RootState } from '../../Store';
import { COLORS } from '../../Shared/commonStyles';
import { useIsMobile, useIsTablet } from '../../Hooks/mobileCheckHook';
import SpeedDial from '../../Components/SpeedDial';

function Home() {
  // state
  const [month, setMonth] = useState(new Date().getMonth());
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [pageType, setPageType] = useState<'income' | 'expense' | 'transfer'>();
  // redux
  const data = useSelector(
    (state: RootState) => state.transactions.transactions
  );
  // constants
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [theme] = useAppTheme();

  return isOpenMobile ? (
    <div className={clsx(isTablet && 'ml-52')}>
      <AddExpense
        isEdit={false}
        pageType={pageType!}
        setIsOpen={setIsOpenMobile}
      />
    </div>
  ) : (
    <div className="sm:ml-48 pt-4 pb-2 px-5">
      <Header month={month} setMonth={setMonth} />
      <div className="flex gap-3">
        <div className="flex flex-col flex-1">
          <div className="flex gap-3 flex-wrap">
            <div className="flex flex-col flex-1 gap-2">
              <OverviewSection month={month} />
              <Graph data={data} month={month} />
            </div>
            <RecentSection month={month} />
          </div>
          <BudgetSection month={month} />
        </div>
        {isOpen && (
          <AddExpense
            setIsOpen={setIsOpen}
            pageType={pageType!}
            isEdit={false}
          />
        )}
        {!isOpen && (
          <div
            className={clsx(
              'hidden lg:flex rounded-lg px-2 sm:px-4 py-4 flex-col gap-y-6',
              theme === 'dark' ? 'bg-black' : 'bg-white'
            )}
          >
            <button
              type="button"
              className="h-14 min-w-14 rounded-lg hover:opacity-85 flex justify-center items-center"
              style={{
                backgroundColor: COLORS.RED[100],
              }}
              onClick={() => {
                setPageType('expense');
                setIsOpen(true);
              }}
              title="Expense"
            >
              <img src={Expense} alt="" width="35px" />
            </button>
            <button
              type="button"
              className="h-14 min-w-14 rounded-lg hover:opacity-85 flex justify-center items-center"
              style={{
                backgroundColor: COLORS.BLUE[100],
              }}
              onClick={() => {
                setPageType('transfer');
                setIsOpen(true);
              }}
              title="Transfer"
            >
              <img src={Transfer} alt="" width="35px" />
            </button>
            <button
              type="button"
              className="h-14 min-w-14 rounded-lg hover:opacity-85 flex justify-center items-center"
              style={{
                backgroundColor: COLORS.GREEN[100],
              }}
              onClick={() => {
                setPageType('income');
                setIsOpen(true);
              }}
              title="Income"
            >
              <img src={Income} alt="" width="35px" />
            </button>
          </div>
        )}
      </div>
      {(isTablet || isMobile) && (
        <SpeedDial openScreen={setIsOpenMobile} setPageType={setPageType} />
      )}
    </div>
  );
}

export default React.memo(Home);
