/* eslint-disable no-restricted-globals */
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { COLORS } from '../../../Shared/commonStyles';
import { RootState } from '../../../Store';
import { formatWithCommas } from '../../../Utils/commonFuncs';
import { currencies } from '../../../Shared/Strings';

function OverviewSection({ month }: Readonly<{ month: number }>) {
  const spends = useSelector(
    (state: RootState) => state.common.user?.spend?.[month]
  );
  const incomes = useSelector(
    (state: RootState) => state.common.user?.income?.[month]
  );
  const currency = useSelector(
    (state: RootState) => state.common.user?.currency
  );
  const conversion = useSelector(
    (state: RootState) => state.transactions.conversion
  );
  const totalSpend = Object.values(spends ?? []).reduce((a, b) => a + b, 0);
  const totalIncome = Object.values(incomes ?? []).reduce((a, b) => a + b, 0);
  const currencyConvert = useCallback(
    (amount: number) => {
      if (
        isNaN(
          Number(
            (
              (conversion?.usd?.[currency?.toLowerCase() ?? 'usd'] ?? 1) *
              amount
            ).toFixed(1)
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
          ).toFixed(1)
        ).toString()
      );
    },
    [conversion?.usd, currency]
  );
  return (
    <div className="rounded-lg bg-white py-4 px-4">
      <p className="text-2xl md:text-3xl lg:text-4xl font-bold">Overview</p>
      <div className="flex mt-5 justify-evenly gap-3 text-center">
        <div className="">
          <p className="text-xl md:text-2xl lg:text-3xl font-semibold">
            {currencies[currency ?? 'usd'].symbol}
            {currencyConvert(9400)}
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
            {currencies[currency ?? 'usd'].symbol}
            {currencyConvert(totalSpend)}
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
            {currencies[currency ?? 'usd'].symbol}
            {currencyConvert(totalIncome)}
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
  );
}

export default React.memo(OverviewSection);
