import React from 'react';
import { Timestamp } from 'firebase/firestore';
import { COLORS } from '../../Shared/commonStyles';
import { catIcons, formatAMPM } from '../../Utils/commonFuncs';
import { TransactionType } from '../../Defs/transaction';
import Money from '../../assets/svgs/money-bag.svg';
import Transfer from '../../assets/svgs/currency-exchange.svg';

function TransactionListItem({
  item,
  width,
}: Readonly<{ item: TransactionType; width: 'full' | 'half' }>) {
  const getAmtSymbol = (x: TransactionType) => {
    if (x.type === 'expense') {
      return '-';
    }
    if (x.type === 'income') {
      return '+';
    }
    return '';
  };
  const getAmtColor = (x: TransactionType) => {
    if (x.type === 'expense') {
      return COLORS.PRIMARY.RED;
    }
    if (x.type === 'income') {
      return COLORS.PRIMARY.GREEN;
    }
    return COLORS.PRIMARY.BLUE;
  };
  return (
    <div
      className={
        width === 'full'
          ? 'flex mb-4 border p-2.5 sm:p-3 rounded-xl gap-x-2'
          : 'flex mb-4 border p-2.5 sm:p-3 rounded-xl gap-x-2 w-5/12 bg-white'
      }
      key={item.id}
    >
      <div
        className="h-12 min-w-12 rounded-lg "
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor:
            item.type === 'transfer'
              ? COLORS.BLUE[80]
              : catIcons[item.category]?.color ?? COLORS.LIGHT[20],
        }}
      >
        {item.type === 'transfer' ? (
          <img src={Transfer} alt="" width="30px" />
        ) : (
          <img
            src={catIcons[item.category]?.icon ?? Money}
            alt=""
            width="30px"
          />
        )}
      </div>
      <div className="w-full overflow-hidden">
        <p className="text-ellipsis overflow-hidden text-lg sm:text-xl font-semibold">
          {item.category[0].toUpperCase() + item.category.slice(1)}
        </p>
        <p className="text-sm sm:text-lg">{item.desc}</p>
      </div>
      <div className="min-w-20 text-end w-full">
        <p
          style={{ color: getAmtColor(item) }}
          className="font-semibold text-lg sm:text-xl overflow-hidden whitespace-nowrap text-ellipsis"
        >
          {getAmtSymbol(item)} ${item.amount}
        </p>
        <p className="text-xs sm:text-sm" style={{ color: COLORS.DARK[25] }}>
          {formatAMPM(
            Timestamp.fromMillis(item.timeStamp.seconds * 1000).toDate()
          )}
        </p>
      </div>
    </div>
  );
}

export default React.memo(TransactionListItem);
