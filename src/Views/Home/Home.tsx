import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store';
import { COLORS } from '../../Shared/commonStyles';
import { monthData } from '../../Shared/Strings';
import NotificationIcon from '../../assets/svgs/notifiaction.svg';
import Graph from './atoms/Graph';
import Income from '../../assets/svgs/income.svg';
import Expense from '../../assets/svgs/expense.svg';
import Transfer from '../../assets/svgs/currency-exchange.svg';
import Close from '../../assets/svgs/close.svg';
import BudgetSection from './atoms/BudgetSection';
import RecentSection from './atoms/RecentSection';
import OverviewSection from './atoms/OverviewSection';
import AddExpense from '../AddExpense/AddExpense';

function Home() {
  const [month, setMonth] = useState(new Date().getMonth());

  const data = useSelector(
    (state: RootState) => state.transactions.transactions
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [pageType, setPageType] = useState<'income' | 'expense' | 'transfer'>();
  return (
    <div className="sm:ml-48 pt-4 px-4">
      <div className="flex justify-between align-middle mb-4">
        <p className="text-4xl font-semibold">Dashboard</p>
        <div className="flex self-center gap-x-3">
          <select
            className="bg-transparent rounded-lg border h-10"
            value={monthData[month].value}
            onChange={(e) => {
              setMonth(Number(e.target.value) - 1);
            }}
          >
            {monthData.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          <img src={NotificationIcon} alt="" width="25px" />
        </div>
      </div>
      <div className="flex gap-3">
        <div className="flex flex-col flex-1">
          <div className="flex gap-3 flex-wrap">
            <div className="flex flex-col flex-1 gap-2 min-w-56">
              <OverviewSection month={month} />
              <div className="rounded-lg bg-white">
                <Graph data={data} month={month} />
              </div>
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
          <div className="hidden sm:flex rounded-lg bg-white px-2 sm:px-4 py-4  flex-col gap-y-6">
            <button
              type="button"
              className="h-14 min-w-14 rounded-lg hover:opacity-85"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
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
              className="h-14 min-w-14 rounded-lg hover:opacity-85"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
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
              className="h-14 min-w-14 rounded-lg hover:opacity-85"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
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
      <div className="absolute sm:hidden bg-purple-300 h-14 w-14 text-4xl rounded-full bottom-6 right-8">
        <p
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <img src={Close} alt="" />
        </p>
      </div>
    </div>
  );
}

export default Home;
