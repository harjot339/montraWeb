import React from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import ProgressBar from '@ramonak/react-progress-bar';
import { RootState } from '../../../Store';
import { formatWithCommas, getMyColor } from '../../../Utils/commonFuncs';
import { currencies, STRINGS } from '../../../Shared/Strings';
import useAppTheme from '../../../Hooks/themeHook';
import Alert from '../../../assets/svgs/alert.svg';

function BudgetSection({ month }: Readonly<{ month: number }>) {
  const budgets = useSelector(
    (state: RootState) => state.common.user?.budget?.[month]
  );
  const spends = useSelector(
    (state: RootState) => state.common.user?.spend?.[month]
  );
  const conversion = useSelector((state: RootState) => state.common.conversion);
  const currency = useSelector(
    (state: RootState) => state.common.user?.currency
  );
  const [theme] = useAppTheme();
  return (
    <div className="flex  gap-3">
      <div
        className={clsx(
          'rounded-lg flex-1 px-4 sm:px-8 py-4 mt-3',
          theme === 'dark' ? 'bg-black' : 'bg-white'
        )}
      >
        <p
          className={clsx(
            'text-2xl md:text-3xl lg:text-4xl font-bold ',
            theme === 'dark' && 'text-white'
          )}
        >
          {STRINGS.Budget}
        </p>
        {Object.entries(budgets ?? {}).length === 0 ? (
          <p className="text-gray-400 mt-3 text-md">
            {STRINGS.NoBudgetForThisMonth}
          </p>
        ) : (
          <table
            className={clsx('w-full mt-4', theme === 'dark' && 'text-white')}
          >
            <tr className="text-xl border-b-2">
              <th>{STRINGS.Category}</th>
              <th>{STRINGS.Percentage}</th>
              <th>{STRINGS.Limit}</th>
              <th>{STRINGS.Spent}</th>
              <th>{STRINGS.Left}</th>
            </tr>
            {Object.entries(budgets ?? {})
              .sort(
                (a, b) =>
                  a[1].limit -
                  (spends?.[a[0]] ?? 0) -
                  (b[1].limit - (spends?.[b[0]] ?? 0))
              )
              .map(([key, val]) => (
                <>
                  <tr>
                    <td>‎</td>
                  </tr>
                  <tr key={key} className="text-center">
                    <td className="text-xl font-semibold flex justify-between">
                      {val.limit - (spends?.[key] ?? 0) < 0 ? (
                        <img
                          src={Alert}
                          width="25px"
                          alt=""
                          title="Budget Exceeded"
                        />
                      ) : (
                        <div />
                      )}
                      {key[0].toUpperCase() + key.slice(1)}
                      <div />
                    </td>
                    <td>
                      <ProgressBar
                        // width="30vw"
                        isLabelVisible={false}
                        bgColor={getMyColor()}
                        completed={
                          (spends?.[key] ?? 0) / val.limit > 1
                            ? 100
                            : ((spends?.[key] ?? 0) / val.limit) * 100
                        }
                        customLabel={`${
                          (spends?.[key] ?? 0) / val.limit > 1
                            ? String(100)
                            : String(
                                (
                                  ((spends?.[key] ?? 0) / val.limit) *
                                  100
                                ).toFixed(0)
                              )
                        }%`}
                      />
                    </td>
                    <td className="text-xl font-semibold">
                      {currencies[currency ?? 'USD'].symbol}
                      {formatWithCommas(
                        Number(
                          (
                            conversion.usd[(currency ?? 'USD').toLowerCase()] *
                            val.limit
                          ).toFixed(1)
                        ).toString()
                      )}
                    </td>
                    <td className="text-xl font-semibold">
                      {currencies[currency ?? 'USD'].symbol}
                      {formatWithCommas(
                        Number(
                          (
                            conversion.usd[(currency ?? 'USD').toLowerCase()] *
                            (spends?.[key] ?? 0)
                          ).toFixed(1)
                        ).toString()
                      )}
                    </td>
                    <td className="text-xl font-semibold">
                      {currencies[currency ?? 'USD'].symbol}
                      {formatWithCommas(
                        Number(
                          (
                            conversion.usd[(currency ?? 'USD').toLowerCase()] *
                            (val.limit - (spends?.[key] ?? 0) < 0
                              ? 0
                              : val.limit - (spends?.[key] ?? 0))
                          ).toFixed(1)
                        ).toString()
                      )}
                    </td>
                  </tr>
                </>
              ))}
          </table>
        )}
      </div>
    </div>
  );
}

export default React.memo(BudgetSection);
