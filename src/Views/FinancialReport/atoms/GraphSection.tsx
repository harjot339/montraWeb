import React from 'react';
// Third Party Libraries
import { Timestamp } from 'firebase/firestore';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
// Custom Components
import TransactionListItem from '../../../Components/TransactionListItem';
import Graph from '../../Home/atoms/Graph';
import { TransactionType } from '../../../Defs/transaction';
import { useIsDesktop } from '../../../Hooks/mobileCheckHook';
import { STRINGS } from '../../../Shared/Strings';
import { COLORS } from '../../../Shared/commonStyles';
import { ROUTES_CONFIG } from '../../../Shared/Constants';

function GraphSection({
  data,
  month,
  type,
  currency,
  setType,
  theme,
}: Readonly<{
  month: number;
  type: 'income' | 'expense';
  currency: string | undefined;
  data: TransactionType[];
  setType: React.Dispatch<React.SetStateAction<'income' | 'expense'>>;
  theme: 'light' | 'dark';
}>) {
  const isDesktop = useIsDesktop();
  const navigate = useNavigate();
  return (
    <div>
      <div className="h-96 mb-5">
        <Graph data={data} month={month} hideDropdown type={type} />
      </div>
      {!isDesktop && (
        <div
          className={clsx(
            'flex w-full h-14 px-2 justify-center items-center rounded-3xl my-3',
            theme === 'dark' ? `bg-[#161719]` : 'bg-gray-100'
          )}
        >
          <div className="flex rounded-3xl h-11 w-full ">
            <button
              type="button"
              onClick={() => {
                setType('expense');
              }}
              className={clsx(
                'flex flex-1 justify-center items-center rounded-3xl outline-none',
                type === 'expense'
                  ? 'bg-[#7F3DFF] text-white'
                  : 'bg-transparent',
                theme === 'dark' && 'text-white'
              )}
            >
              {STRINGS.Expense}
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
              }}
              className={clsx(
                'flex flex-1 justify-center items-center rounded-3xl outline-none',
                type === 'income'
                  ? 'bg-[#7F3DFF] text-white'
                  : 'bg-transparent',
                theme === 'dark' && 'text-white'
              )}
            >
              {STRINGS.Income}
            </button>
          </div>
        </div>
      )}
      {data.slice().filter((item) => {
        return (
          Timestamp.fromMillis(item.timeStamp.seconds * 1000)
            .toDate()
            ?.getMonth() === month && item.type === type
        );
      }).length !== 0 && (
        <div className="px-2">
          <div className="flex justify-between pt-3">
            <p
              className={clsx(
                'text-2xl md:text-3xl lg:text-4xl font-bold mb-4 items-center',
                theme === 'dark' && 'text-white'
              )}
            >
              {`${STRINGS.Transaction}s`}
            </p>
            <button
              type="button"
              className="rounded-2xl px-4 h-8 text-sm sm:text-base font-semibold"
              style={{
                backgroundColor: COLORS.VIOLET[20],
                color: COLORS.VIOLET[100],
              }}
              onClick={() => {
                navigate(ROUTES_CONFIG.Transactions.path);
              }}
            >
              {STRINGS.SeeAll}
            </button>
          </div>
          {data
            .slice()
            .filter((item) => {
              return (
                Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                  .toDate()
                  ?.getMonth() === month && item.type === type
              );
            })
            .sort((a, b) => b.timeStamp.seconds - a.timeStamp.seconds)
            .slice(0, 5)
            .map((item) => (
              <TransactionListItem
                disabled
                item={item}
                key={item.id}
                width="full"
                currency={currency}
              />
            ))}
        </div>
      )}
    </div>
  );
}

export default React.memo(GraphSection);
