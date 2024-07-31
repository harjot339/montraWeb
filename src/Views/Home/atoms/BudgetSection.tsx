import React from 'react';
// Third Party Libraries
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import ProgressBar from '@ramonak/react-progress-bar';
// Custom Components
import { RootState } from '../../../Store';
import { formatWithCommas } from '../../../Utils/commonFuncs';
import { currencies, STRINGS } from '../../../Shared/Strings';
import useAppTheme from '../../../Hooks/themeHook';
import Alert from '../../../assets/svgs/alert.svg';

function BudgetSection({ month }: Readonly<{ month: number }>) {
  // redux
  const budgets = useSelector(
    (state: RootState) => state.common.user?.budget?.[month]
  );
  const expenseColors = useSelector(
    (state: RootState) => state.common.user?.expenseColors
  );
  const spends = useSelector(
    (state: RootState) => state.common.user?.spend?.[month]
  );
  const currency = useSelector(
    (state: RootState) => state.common.user?.currency
  );
  // constants
  const [theme] = useAppTheme();

  return (
    <div className="hidden md:flex gap-3">
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
            <tr className="text-md sm:text-xl border-b-2">
              <th>{STRINGS.Category}</th>
              <th className="hidden lg:table-cell">{STRINGS.Percentage}</th>
              <th>{STRINGS.Limit}</th>
              <th>{STRINGS.Spent}</th>
              <th>{STRINGS.Left}</th>
            </tr>
            {Object.entries(budgets ?? {})
              .sort(
                (a, b) =>
                  a[1].limit -
                  (spends?.[a[0]]?.[currency?.toUpperCase() ?? 'USD'] ?? 0) -
                  (b[1].limit -
                    (spends?.[b[0]]?.[currency?.toUpperCase() ?? 'USD'] ?? 0))
              )
              .map(([key, val]) => {
                return (
                  <>
                    <tr>
                      <td>‎</td>
                    </tr>
                    <tr key={key} className="text-center text-sm sm:text-lg">
                      <td className="font-semibold flex justify-between">
                        {val.limit - (spends?.[key]?.USD ?? 0) < 0 ? (
                          <img
                            src={Alert}
                            width="25px"
                            alt=""
                            title="Budget Exceeded"
                          />
                        ) : (
                          <div style={{ width: '25px' }} />
                        )}
                        {key[0].toUpperCase() + key.slice(1)}
                        <div />
                      </td>
                      <td
                        className="hidden lg:table-cell"
                        onMouseOver={() => {}}
                        onFocus={() => {}}
                        title={`${
                          currencies[currency ?? 'USD'].symbol +
                          formatWithCommas(
                            Number(
                              (
                                spends?.[key]?.[
                                  currency?.toUpperCase() ?? 'USD'
                                ] ?? 0
                              ).toFixed(2)
                            ).toString()
                          )
                        } of ${
                          currencies[currency ?? 'USD'].symbol
                        }${formatWithCommas(
                          Number(
                            (
                              val.conversion.usd[
                                (currency ?? 'USD').toLowerCase()
                              ] * val.limit
                            ).toFixed(2)
                          ).toString()
                        )}`}
                      >
                        <ProgressBar
                          // width="30vw"
                          isLabelVisible={false}
                          bgColor={expenseColors?.[key] ?? 'green'}
                          completed={
                            (spends?.[key]?.USD ?? 0) / val.limit > 1
                              ? 100
                              : ((spends?.[key]?.USD ?? 0) / val.limit) * 100
                          }
                          customLabel={`${
                            (spends?.[key]?.[
                              currency?.toUpperCase() ?? 'USD'
                            ] ?? 0) /
                              val.limit >
                            1
                              ? String(100)
                              : String(
                                  (
                                    ((spends?.[key]?.[
                                      currency?.toUpperCase() ?? 'USD'
                                    ] ?? 0) /
                                      val.limit) *
                                    100
                                  ).toFixed(0)
                                )
                          }%`}
                          borderRadius="9999999999px"
                        />
                      </td>
                      <td className="font-semibold">
                        {currencies[currency ?? 'USD'].symbol}
                        {formatWithCommas(
                          Number(
                            (
                              val.conversion.usd[
                                (currency ?? 'USD').toLowerCase()
                              ] * val.limit
                            ).toFixed(2)
                          ).toString()
                        )}
                      </td>
                      <td className="font-semibold">
                        {currencies[currency ?? 'USD'].symbol}
                        {formatWithCommas(
                          Number(
                            (
                              spends?.[key]?.[
                                currency?.toUpperCase() ?? 'USD'
                              ] ?? 0
                            ).toFixed(2)
                          ).toString()
                        )}
                      </td>
                      <td className="font-semibold">
                        {currencies[currency ?? 'USD'].symbol}
                        {formatWithCommas(
                          Number(
                            (val.limit - (spends?.[key]?.USD ?? 0) < 0
                              ? 0
                              : val.limit *
                                  val.conversion.usd[
                                    currency?.toLowerCase() ?? 'usd'
                                  ] -
                                (spends?.[key]?.[
                                  currency?.toUpperCase() ?? 'USD'
                                ] ?? 0)
                            ).toFixed(2)
                          ).toString()
                        )}
                      </td>
                    </tr>
                  </>
                );
              })}
          </table>
        )}
      </div>
    </div>
  );
}

export default React.memo(BudgetSection);
