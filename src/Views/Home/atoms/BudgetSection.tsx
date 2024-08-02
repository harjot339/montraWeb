import React from 'react';
// Third Party Libraries
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import ProgressBar from '@ramonak/react-progress-bar';
import { useNavigate } from 'react-router-dom';
// Custom Components
import { RootState } from '../../../Store';
import { formatWithCommas } from '../../../Utils/commonFuncs';
import { currencies, STRINGS } from '../../../Shared/Strings';
import useAppTheme from '../../../Hooks/themeHook';
import Alert from '../../../assets/svgs/alert.svg';
import { COLORS } from '../../../Shared/commonStyles';
import { ROUTES_CONFIG } from '../../../Shared/Constants';

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
  const navigate = useNavigate();
  return (
    <div className="hidden md:flex gap-3">
      <div
        className={clsx(
          'rounded-lg flex-1 px-4 sm:px-8 py-4 mt-3',
          theme === 'dark' ? 'bg-black' : 'bg-white'
        )}
      >
        <div className="flex justify-between">
          <p
            className={clsx(
              'text-2xl md:text-3xl lg:text-4xl font-bold ',
              theme === 'dark' && 'text-white'
            )}
          >
            {STRINGS.Budget}
          </p>
          {Object.entries(budgets ?? {}).slice(0, 4).length === 0 ? (
            <div className="w-16 h-0" />
          ) : (
            <button
              type="button"
              className="rounded-2xl px-4 h-8 text-sm sm:text-base font-semibold"
              style={{
                backgroundColor: COLORS.VIOLET[20],
                color: COLORS.VIOLET[100],
              }}
              onClick={() => {
                navigate(ROUTES_CONFIG.Budgets.path);
              }}
            >
              {STRINGS.SeeAll}
            </button>
          )}
        </div>
        {Object.entries(budgets ?? {}).slice(0, 4).length === 0 ? (
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
              .sort((a, b) => {
                if (a[0] < b[0]) {
                  return -1;
                }
                if (a[0] > b[0]) {
                  return 1;
                }
                return 0;
              })
              .slice(0, 4)
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
                            (
                              spends?.[key]?.[
                                currency?.toUpperCase() ?? 'USD'
                              ] ?? 0
                            )
                              .toFixed(2)
                              .toString()
                          )
                        } of ${
                          currencies[currency ?? 'USD'].symbol
                        }${formatWithCommas(
                          (
                            val.conversion.usd[
                              (currency ?? 'USD').toLowerCase()
                            ] * val.limit
                          )
                            .toFixed(2)
                            .toString()
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
                          borderRadius="9999999999px"
                        />
                      </td>
                      <td className="font-semibold">
                        {currencies[currency ?? 'USD'].symbol}
                        {formatWithCommas(
                          (
                            val.conversion.usd[
                              (currency ?? 'USD').toLowerCase()
                            ] * val.limit
                          )
                            .toFixed(2)
                            .toString()
                        )}
                      </td>
                      <td className="font-semibold">
                        {currencies[currency ?? 'USD'].symbol}
                        {formatWithCommas(
                          (
                            spends?.[key]?.[currency?.toUpperCase() ?? 'USD'] ??
                            0
                          )
                            .toFixed(2)
                            .toString()
                        )}
                      </td>
                      <td className="font-semibold">
                        {currencies[currency ?? 'USD'].symbol}
                        {formatWithCommas(
                          (val.limit - (spends?.[key]?.USD ?? 0) < 0
                            ? 0
                            : val.limit *
                                val.conversion.usd[
                                  currency?.toLowerCase() ?? 'usd'
                                ] -
                              (spends?.[key]?.[
                                currency?.toUpperCase() ?? 'USD'
                              ] ?? 0)
                          )
                            .toFixed(2)
                            .toString()
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
