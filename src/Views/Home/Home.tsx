import React, { useState } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store';
import { COLORS } from '../../Shared/commonStyles';
import Graph from './atoms/Graph';
import Income from '../../assets/svgs/income.svg';
import Expense from '../../assets/svgs/expense.svg';
import Transfer from '../../assets/svgs/currency-exchange.svg';
// import Close from '../../assets/svgs/close.svg'
import BudgetSection from './atoms/BudgetSection';
import RecentSection from './atoms/RecentSection';
import OverviewSection from './atoms/OverviewSection';
import AddExpense from '../AddExpense/AddExpense';
import Header from './atoms/Header';
import useAppTheme from '../../Hooks/themeHook';

function Home() {
  const [month, setMonth] = useState(new Date().getMonth());

  const data = useSelector(
    (state: RootState) => state.transactions.transactions
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [pageType, setPageType] = useState<'income' | 'expense' | 'transfer'>();
  const [theme] = useAppTheme();
  return (
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
              'hidden sm:flex rounded-lg px-2 sm:px-4 py-4 flex-col gap-y-6',
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
      {/* <div className="absolute sm:hidden bg-purple-300 h-14 w-14 text-4xl rounded-full bottom-6 right-8">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <img src={Close} alt="" />
        </div>
      </div> */}
    </div>
  );
}

export default React.memo(Home);
