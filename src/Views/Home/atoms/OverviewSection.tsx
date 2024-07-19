import React, { useCallback } from 'react';
// Third Party Librarires
import { useSelector } from 'react-redux';
import clsx from 'clsx';
// Custom Components
import { COLORS } from '../../../Shared/commonStyles';
import { RootState } from '../../../Store';
import { formatWithCommas } from '../../../Utils/commonFuncs';
import { currencies, STRINGS } from '../../../Shared/Strings';
import useAppTheme from '../../../Hooks/themeHook';

function OverviewSection({ month }: Readonly<{ month: number }>) {
  // redux
  const spends = useSelector(
    (state: RootState) => state.common.user?.spend?.[month]
  );
  const incomes = useSelector(
    (state: RootState) => state.common.user?.income?.[month]
  );
  const currency = useSelector(
    (state: RootState) => state.common.user?.currency
  );
  const conversion = useSelector((state: RootState) => state.common.conversion);
  const totalSpend = Object.values(spends ?? []).reduce((a, b) => a + b, 0);
  const totalIncome = Object.values(incomes ?? []).reduce((a, b) => a + b, 0);
  // functions
  const currencyConvert = useCallback(
    (amount: number) => {
      if (
        Number.isNaN(
          Number(
            (
              (conversion?.usd?.[currency?.toLowerCase() ?? 'usd'] ?? 1) *
              amount
            ).toFixed(2)
          )
        )
      ) {
        return 0;
      }
      return formatWithCommas(
        Number(
          (
            (conversion?.usd?.[currency?.toLowerCase() ?? 'usd'] ?? 1) *
            Number(amount)
          ).toFixed(2)
        ).toString()
      );
    },
    [conversion?.usd, currency]
  );
  const [theme] = useAppTheme();
  return (
    <div
      className={clsx(
        'rounded-lg py-4 px-2 sm:px-4',
        theme === 'dark' ? 'bg-black' : 'bg-white'
      )}
    >
      <p
        className={clsx(
          'text-2xl md:text-3xl lg:text-4xl font-bold',
          theme === 'dark' && 'text-white'
        )}
      >
        {STRINGS.Overview}
      </p>
      <div className="flex mt-5 justify-evenly gap-2 text-center">
        <div>
          <p
            className={clsx(
              'text-xl md:text-2xl lg:text-3xl font-semibold max-sm:max-w-24 overflow-hidden text-ellipsis whitespace-nowrap',
              theme === 'dark' && 'text-white'
            )}
          >
            {currencies[currency ?? 'USD'].symbol}
            {currencyConvert(9400)}
          </p>
          <p
            className="text-md md:text-lg font-normal"
            style={{ color: COLORS.DARK[25] }}
          >
            {STRINGS.AccountBalance}
          </p>
        </div>
        <div>
          <p
            className={clsx(
              'text-xl md:text-2xl lg:text-3xl font-semibold overflow-hidden text-ellipsis whitespace-nowrap',
              theme === 'dark' && 'text-white'
            )}
          >
            {currencies[currency ?? 'USD'].symbol}
            {currencyConvert(totalSpend)}
          </p>
          <p
            className="text-md md:text-lg font-normal"
            style={{ color: COLORS.DARK[25] }}
          >
            {STRINGS.Expense}
          </p>
        </div>
        <div>
          <p
            className={clsx(
              'text-xl md:text-2xl lg:text-3xl font-semibold overflow-hidden text-ellipsis whitespace-nowrap',
              theme === 'dark' && 'text-white'
            )}
          >
            {currencies[currency ?? 'USD'].symbol}
            {currencyConvert(totalIncome)}
          </p>
          <p
            className="text-md md:text-lg font-normal"
            style={{ color: COLORS.DARK[25] }}
          >
            {STRINGS.Income}
          </p>
        </div>
      </div>
    </div>
  );
}

export default React.memo(OverviewSection);
