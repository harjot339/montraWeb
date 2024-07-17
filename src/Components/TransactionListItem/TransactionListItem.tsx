import React from 'react';
import { Timestamp } from 'firebase/firestore';
import clsx from 'clsx';
import {
  catIcons,
  formatAMPM,
  formatWithCommas,
} from '../../Utils/commonFuncs';
import { COLORS } from '../../Shared/commonStyles';
import { TransactionType } from '../../Defs/transaction';
import Money from '../../assets/svgs/money-bag.svg';
import Transfer from '../../assets/svgs/currency-exchange.svg';
import { currencies } from '../../Shared/Strings';
import useAppTheme from '../../Hooks/themeHook';

function TransactionListItem({
  item,
  width,
  currency,
  conversion,
  disabled = false,
  onClick,
  selected = false,
}: Readonly<{
  item: TransactionType;
  width: 'full' | 'half';
  currency: string | undefined;
  conversion: {
    [key: string]: {
      [key: string]: number;
    };
  };
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
}>) {
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
  const [theme] = useAppTheme();
  return (
    <button
      onClick={onClick}
      type="button"
      disabled={disabled}
      className={clsx(
        'flex mb-4 border p-2.5 sm:p-3 rounded-xl gap-x-2  items-center outline-none text-start ',
        theme === 'dark' ? 'bg-black' : 'bg-white'
      )}
      style={{
        width: '100%',
        maxWidth: width === 'half' ? '400px' : '',
        // minWidth: width === 'half' ? '200px' : undefined,
        backgroundColor: selected ? COLORS.VIOLET[20] : '',
      }}
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
        <p
          className={clsx(
            'text-ellipsis overflow-hidden text-lg sm:text-xl font-semibold',
            theme === 'dark' && 'text-white'
          )}
          style={{ color: selected ? COLORS.VIOLET[100] : '' }}
        >
          {item?.type === 'transfer'
            ? `${
                item.from[0].toUpperCase() + item.from.slice(1)
              } - ${item.to[0].toUpperCase()}${item.to.slice(1)}`
            : item.category[0].toUpperCase() + item.category.slice(1)}
        </p>
        <p
          className={clsx(
            'text-sm sm:text-lg text-ellipsis overflow-hidden whitespace-nowrap',
            theme === 'dark' && 'text-white'
          )}
        >
          {item.desc}
        </p>
      </div>
      <div className="min-w-20 text-end w-full">
        <p
          style={{ color: getAmtColor(item) }}
          className="font-semibold text-lg sm:text-xl overflow-hidden whitespace-nowrap text-ellipsis"
        >
          {getAmtSymbol(item)} {currencies[currency ?? 'USD'].symbol}
          {formatWithCommas(
            Number(
              (
                conversion.usd[(currency ?? 'USD').toLowerCase()] * item.amount
              ).toFixed(2)
            ).toString()
          )}
        </p>
        <p className="text-xs sm:text-sm" style={{ color: COLORS.DARK[25] }}>
          {formatAMPM(
            Timestamp.fromMillis(item.timeStamp.seconds * 1000).toDate()
          )}
        </p>
      </div>
    </button>
  );
}

export default React.memo(TransactionListItem);
