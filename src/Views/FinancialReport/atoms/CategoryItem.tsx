import React from 'react';
import ProgressBar from '@ramonak/react-progress-bar';
import clsx from 'clsx';
import { COLORS } from '../../../Shared/commonStyles';
import { currencies } from '../../../Shared/Strings';
import { formatWithCommas } from '../../../Utils/commonFuncs';

function CategoryItem({
  item,
  catColors,
  type,
  currency,
  conversion,
  theme,
  totalSpend,
  totalIncome,
}: Readonly<{
  item: [string, number];
  catColors:
    | {
        [key: string]: string;
      }
    | undefined;
  type: 'income' | 'expense';
  currency: string | undefined;
  conversion: {
    [key: string]: {
      [key: string]: number;
    };
  };
  theme: 'light' | 'dark';
  totalSpend: number;
  totalIncome: number;
}>) {
  return (
    <div className="flex flex-col px-1 sm:px-6 py-2 w-full" key={item[0]}>
      <div className="flex w-full justify-between items-center mb-4">
        <div className="flex items-center gap-x-3 justify-between px-5 py-2 rounded-3xl border">
          <div
            className="w-5 h-5 rounded-full"
            style={{
              backgroundColor: catColors?.[item[0]] ?? 'green',
            }}
          />
          <p
            className={clsx(
              'text-sm sm:text-md',
              theme === 'dark' && 'text-white'
            )}
          >
            {item[0][0].toUpperCase() + item[0].slice(1)}
          </p>
        </div>
        <p
          className="text-lg sm:text-xl md:text-2xl font-semibold text-ellipsis overflow-hidden whitespace-nowrap"
          style={{
            color: type === 'expense' ? COLORS.RED[100] : COLORS.GREEN[100],
          }}
        >
          {type === 'expense' ? '- ' : '+ '}
          {currencies[currency!].symbol}
          {formatWithCommas(
            Number(
              (conversion.usd[currency!.toLowerCase()] * item[1]).toFixed(2)
            ).toString()
          )}
        </p>
      </div>
      <ProgressBar
        isLabelVisible={false}
        completed={(
          (item[1] /
            (type === 'expense' ? Number(totalSpend) : Number(totalIncome))) *
          100
        ).toFixed(0)}
        bgColor={catColors?.[item[0]] ?? 'green'}
      />
    </div>
  );
}

export default React.memo(CategoryItem);
