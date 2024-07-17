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
  conversion,
  onClick,
  color,
}: Readonly<{
  item: [
    string,
    {
      alert: boolean;
      limit: number;
      percentage: number;
    },
  ];
  spend: {
    [key: string]: number;
  };
  currency: string | undefined;
  conversion: {
    [key: string]: {
      [key: string]: number;
    };
  };
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
      if (val.limit - spend[key] < 0) {
        return '0';
      }
      if (spend[key] === undefined) {
        return (conversion.usd[currency!.toLowerCase()] * val.limit).toFixed(2);
      }
      return (
        conversion.usd[currency!.toLowerCase()] *
        (val.limit - (spend[key] ?? 0))
      ).toFixed(2);
    },
    [conversion.usd, currency, spend]
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
        {(spend[key] ?? 0) >= val.limit && (
          <img src={Alert} width="30px" alt="" />
        )}
      </div>
      <p className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-3 text-ellipsis overflow-hidden whitespace-nowrap">
        {STRINGS.Remaining} {currencies[currency!].symbol}
        {formatWithCommas(Number(getValue(val, key)).toString())}
      </p>
      <div className="max-w-96 w-full">
        <ProgressBar
          width="100%"
          bgColor={color}
          completed={
            (spend?.[key] ?? 0) / val.limit > 1
              ? 100
              : ((spend?.[key] ?? 0) / val.limit) * 100
          }
          isLabelVisible={false}
        />
      </div>
      <p className="text-lg sm:text-xl md:text-2xl font-semibold mt-2 mb-3">
        {currencies[currency!].symbol}
        {formatWithCommas(
          Number(
            (
              conversion.usd[currency!.toLowerCase()] * (spend[key] ?? 0)
            ).toFixed(2)
          ).toString()
        )}{' '}
        of {currencies[currency!].symbol}
        {formatWithCommas(
          Number(
            (conversion.usd[currency!.toLowerCase()] * val.limit).toFixed(2)
          ).toString()
        )}
      </p>
      {(spend[key] ?? 0) >= val.limit && (
        <p className="text-red-500">{STRINGS.LimitExceeded}</p>
      )}
    </button>
  );
}

export default React.memo(BudgetItem);
