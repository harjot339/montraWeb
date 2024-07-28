import React from 'react';
import clsx from 'clsx';
// Third Party Librarires
import { Timestamp } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../../Shared/commonStyles';
import TransactionListItem from '../../../Components/TransactionListItem';
import { RootState } from '../../../Store';
import { ROUTES_CONFIG } from '../../../Shared/Constants';
import { STRINGS } from '../../../Shared/Strings';
import useAppTheme from '../../../Hooks/themeHook';

function RecentSection({ month }: Readonly<{ month: number }>) {
  // redux
  const data = useSelector(
    (state: RootState) => state.transactions.transactions
  );
  const currency = useSelector(
    (state: RootState) => state.common.user?.currency
  );
  // constants
  const navigate = useNavigate();
  const [theme] = useAppTheme();
  return (
    <div
      className={clsx(
        'rounded-lg flex-1 px-4 sm:px-8 py-4',
        theme === 'dark' ? 'bg-black' : 'bg-white'
      )}
    >
      <div className="flex justify-between">
        <p
          className={clsx(
            'text-2xl md:text-3xl lg:text-4xl font-bold mb-4',
            theme === 'dark' && 'text-white'
          )}
        >
          {STRINGS.Recent}
        </p>
        {data.slice().filter((item) => {
          return (
            Timestamp.fromMillis(item.timeStamp.seconds * 1000)
              .toDate()
              ?.getMonth() === month
          );
        }).length === 0 ? (
          <div className="w-16 h-0" />
        ) : (
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
        )}
      </div>
      <div className="flex flex-col gap-y-2.5 mt-2 items-center">
        {data.slice().filter((item) => {
          return (
            Timestamp.fromMillis(item.timeStamp.seconds * 1000)
              .toDate()
              ?.getMonth() === month
          );
        }).length === 0 ? (
          <div className="flex w-full h-full justify-center items-center">
            <p className="text-gray-400">{STRINGS.NoRecentTransactions}</p>
          </div>
        ) : (
          data
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
              <TransactionListItem
                // disabled
                item={item}
                key={item.id}
                width="full"
                currency={currency}
                onClick={() => {
                  navigate(`${ROUTES_CONFIG.Transactions.path}/${item.id}`);
                }}
              />
            ))
        )}
      </div>
    </div>
  );
}

export default React.memo(RecentSection);
