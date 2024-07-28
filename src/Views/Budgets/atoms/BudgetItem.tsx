import ProgressBar from '@ramonak/react-progress-bar';
import React, { useCallback } from 'react';
import clsx from 'clsx';
import { STRINGS, currencies } from '../../../Shared/Strings';
import { formatWithCommas } from '../../../Utils/commonFuncs';
import Alert from '../../../assets/svgs/alert.svg';
import useAppTheme from '../../../Hooks/themeHook';

function BudgetItem({
  item,
  spend,
  currency,
  // conversion,
  onClick,
  color,
}: Readonly<{
  item: [
    string,
    {
      alert: boolean;
      limit: number;
      percentage: number;
      conversion: {
        [key: string]: {
          [key: string]: number;
        };
      };
    },
  ];
  spend: {
    [category: string]: {
      [currency: string]: number;
    };
  };
  currency: string | undefined;
  // conversion: {
  //   [key: string]: {
  //     [key: string]: number;
  //   };
  // };
  onClick: () => void;
  color: string;
}>) {
  const getValue = useCallback(
    (
      val: {
        alert: boolean;
        limit: number;
        percentage: number;
      },
      key: string
    ) => {
      if (spend?.[key]?.USD === undefined) {
        return (
          item[1].conversion.usd[currency?.toLowerCase() ?? 'usd'] * val.limit
        ).toFixed(2);
      }
      if (val.limit - (spend?.[key]?.USD ?? 0) < 0) {
        return '0';
      }
      return (
        val.limit * item[1].conversion.usd[currency?.toLowerCase() ?? 'usd'] -
        (spend?.[key]?.[currency?.toUpperCase() ?? 'USD'] ?? 0)
      ).toFixed(2);
    },
    [currency, item, spend]
  );
  const key = item[0];
  const val = item[1];
  const [theme] = useAppTheme();
  return (
    <button
      type="button"
      key={key}
      className={clsx(
        'flex rounded-lg px-2 sm:px-4 py-4 w-full max-w-lg flex-col text-ellipsis overflow-hidden whitespace-nowrap',
        theme === 'dark' ? 'bg-black text-white' : 'bg-white'
      )}
      onClick={onClick}
    >
      <div className="flex justify-between mb-3 w-full ">
        <div className="flex items-center gap-x-3 justify-between px-5 py-2 rounded-3xl border">
          <div
            className="w-5 h-5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <p>{key[0].toUpperCase() + key.slice(1)}</p>
        </div>
        {(spend?.[key]?.USD ?? 0) >= val.limit && (
          <img src={Alert} width="30px" alt="" />
        )}
      </div>
      <p className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3">
        {STRINGS.Remaining} {currencies[currency!].symbol}
        {formatWithCommas(Number(getValue(val, key)).toString())}
      </p>
      <div className="max-w-96 w-full">
        <ProgressBar
          width="100%"
          bgColor={color}
          completed={
            (spend?.[key]?.USD ?? 0) / val.limit > 1
              ? 100
              : ((spend?.[key]?.USD ?? 0) / val.limit) * 100
          }
          isLabelVisible={false}
        />
      </div>
      <p className="text-lg sm:text-xl md:text-2xl font-semibold mt-2 mb-3">
        {currencies[currency!].symbol}
        {formatWithCommas(
          Number(
            (spend?.[key]?.[currency?.toUpperCase() ?? 'USD'] ?? 0).toFixed(2)
          ).toString()
        )}{' '}
        of {currencies[currency!].symbol}
        {formatWithCommas(
          Number(
            (
              (item[1]?.conversion?.usd?.[currency?.toLowerCase() ?? 'usd'] ??
                0) * val.limit
            ).toFixed(2)
          ).toString()
        )}
      </p>
      {(spend?.[key]?.USD ?? 0) >= val.limit && (
        <p className="text-red-500">{STRINGS.LimitExceeded}</p>
      )}
    </button>
  );
}

export default React.memo(BudgetItem);
