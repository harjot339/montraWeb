import React from 'react';
import { Timestamp } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../../Shared/commonStyles';
import TransactionListItem from '../../../Components/TransactionListItem';
import { RootState } from '../../../Store';
import { ROUTES_CONFIG } from '../../../Shared/Constants';

function RecentSection({ month }: Readonly<{ month: number }>) {
  const data = useSelector(
    (state: RootState) => state.transactions.transactions
  );
  const navigate = useNavigate();
  return (
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
          onClick={() => {
            navigate(ROUTES_CONFIG.Transactions.path);
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
          <TransactionListItem item={item} key={item.id} width="full" />
        ))}
    </div>
  );
}

export default React.memo(RecentSection);
