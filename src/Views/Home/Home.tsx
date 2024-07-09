import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Timestamp } from 'firebase/firestore';
import ProgressBar from '@ramonak/react-progress-bar';
import { RootState } from '../../Store';
import { COLORS } from '../../Shared/commonStyles';
import { monthData } from '../../Shared/Strings';
import NotificationIcon from '../../assets/svgs/notifiaction.svg';
import TransactionListItem from '../../Components/TransactionListItem';
import Graph from './atoms/Graph';
import Income from '../../assets/svgs/income.svg';
import Expense from '../../assets/svgs/expense.svg';
import Transfer from '../../assets/svgs/currency-exchange.svg';
import { getMyColor } from '../../Utils/commonFuncs';

function Home() {
  const [month, setMonth] = useState(new Date().getMonth());
  const spends = useSelector(
    (state: RootState) => state.common.user?.spend?.[month]
  );
  const incomes = useSelector(
    (state: RootState) => state.common.user?.income?.[month]
  );
  const budgets = useSelector(
    (state: RootState) => state.common.user?.budget?.[month]
  );
  const data = useSelector(
    (state: RootState) => state.transactions.transactions
  );
  const totalSpend = Object.values(spends ?? []).reduce((a, b) => a + b, 0);
  const totalIncome = Object.values(incomes ?? []).reduce((a, b) => a + b, 0);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="sm:ml-48 pt-4 px-4">
      <div
        className="flex justify-between align-middle mb-4"
        // style={{
        //   justifyContent: 'space-between',
        //   alignItems: 'center',
        // }}
      >
        <p className="text-4xl font-semibold">Home</p>
        <div className="flex self-center gap-x-3">
          <select
            className="bg-transparent rounded-lg border h-10"
            value={monthData[month].value}
            onChange={(e) => {
              // console.log(e.target.value)
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
              <div className="rounded-lg bg-white py-4 px-4">
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold">
                  Overview
                </p>

                <div className="flex mt-5 justify-evenly gap-3 text-center">
                  <div className="">
                    <p className="text-xl md:text-2xl lg:text-3xl font-semibold">
                      $9400
                    </p>
                    <p
                      className="text-md md:text-lg font-normal"
                      style={{ color: COLORS.DARK[25] }}
                    >
                      Account Balance
                    </p>
                  </div>
                  <div className="">
                    <p className="text-xl md:text-2xl lg:text-3xl font-semibold">
                      ${totalSpend}
                    </p>
                    <p
                      className="text-md md:text-lg font-normal"
                      style={{ color: COLORS.DARK[25] }}
                    >
                      Expense
                    </p>
                  </div>
                  <div className="">
                    <p className="text-xl md:text-2xl lg:text-3xl font-semibold">
                      ${totalIncome}
                    </p>
                    <p
                      className="text-md md:text-lg font-normal"
                      style={{ color: COLORS.DARK[25] }}
                    >
                      Income
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-white">
                <Graph data={data} month={month} />
              </div>
            </div>

            <div className="rounded-lg min-w-56 flex-1 bg-white px-4 sm:px-8 py-4">
              <div className="flex justify-between">
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                  Recent
                </p>
                <button
                  type="button"
                  className="rounded-2xl px-4 h-8 text-sm sm:text-base font-semibold"
                  style={{
                    backgroundColor: COLORS.VIOLET[20],
                    color: COLORS.VIOLET[100],
                  }}
                >
                  See All
                </button>
              </div>
              {data
                .slice()
                .filter((item) => {
                  return (
                    Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                      .toDate()
                      ?.getMonth() === month
                  );
                })
                .sort((a, b) => b.timeStamp.seconds - a.timeStamp.seconds)
                .slice(0, 5)
                .map((item) => (
                  <TransactionListItem item={item} key={item.id} />
                ))}
            </div>
          </div>
          <div className="flex  gap-3">
            <div className="rounded-lg flex-1 bg-white px-4 sm:px-8 py-4 mt-3">
              <p className="text-2xl md:text-3xl lg:text-4xl font-bold ">
                Budgets
              </p>
              <table className="w-full mt-4">
                <tr className="text-xl border-b-2">
                  <th>Category</th>
                  <th>Percentage</th>
                  <th>Limit</th>
                  <th>Spent</th>
                  <th>Left</th>
                </tr>
                {Object.entries(budgets ?? {}).map(([key, val]) => (
                  <>
                    <tr>
                      <td>‎</td>
                    </tr>
                    <tr key={key} className="text-center">
                      <td className="text-xl font-semibold">
                        {key[0].toUpperCase() + key.slice(1)}
                      </td>
                      <td width="30vw">
                        <ProgressBar
                          width="30vw"
                          bgColor={getMyColor()}
                          completed={
                            (spends?.[key] ?? 0) / val.limit > 1
                              ? 100
                              : ((spends?.[key] ?? 0) / val.limit) * 100
                          }
                        />
                      </td>
                      <td className="text-xl font-semibold">{val.limit}</td>
                      <td className="text-xl font-semibold">
                        {spends?.[key] ?? 0}
                      </td>
                      <td className="text-xl font-semibold">
                        {val.limit - (spends?.[key] ?? 0) < 0
                          ? 0
                          : val.limit - (spends?.[key] ?? 0)}
                      </td>
                    </tr>
                  </>
                ))}
              </table>
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="rounded-lg flex-1 bg-white px-4 sm:px-8 py-4">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              X
            </button>
          </div>
        )}
        {!isOpen && (
          <div className="rounded-lg bg-white px-2 sm:px-4 py-4 flex flex-col gap-y-6">
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
                setIsOpen(true);
              }}
              title="Income"
            >
              <img src={Income} alt="" width="35px" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
