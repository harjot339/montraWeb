import React from 'react';
import { useSelector } from 'react-redux';
import ProgressBar from '@ramonak/react-progress-bar';
import { RootState } from '../../../Store';
import { getMyColor } from '../../../Utils/commonFuncs';

function BudgetSection({ month }: Readonly<{ month: number }>) {
  const budgets = useSelector(
    (state: RootState) => state.common.user?.budget?.[month]
  );
  const spends = useSelector(
    (state: RootState) => state.common.user?.spend?.[month]
  );
  return (
    <div className="flex  gap-3">
      <div className="rounded-lg flex-1 bg-white px-4 sm:px-8 py-4 mt-3">
        <p className="text-2xl md:text-3xl lg:text-4xl font-bold ">Budgets</p>
        <table className="w-full mt-4">
          <tr className="text-xl border-b-2">
            <th>Category</th>
            <th>Percentage</th>
            <th>Limit</th>
            <th>Spent</th>
            <th>Left</th>
          </tr>
          {Object.entries(budgets ?? {}).map(([key, val]) => (
            <>
              <tr>
                <td>‎</td>
              </tr>
              <tr key={key} className="text-center">
                <td className="text-xl font-semibold">
                  {key[0].toUpperCase() + key.slice(1)}
                </td>
                <td width="30vw">
                  <ProgressBar
                    width="30vw"
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
                            (((spends?.[key] ?? 0) / val.limit) * 100).toFixed(
                              0
                            )
                          )
                    }%`}
                  />
                </td>
                <td className="text-xl font-semibold">{val.limit}</td>
                <td className="text-xl font-semibold">{spends?.[key] ?? 0}</td>
                <td className="text-xl font-semibold">
                  {val.limit - (spends?.[key] ?? 0) < 0
                    ? 0
                    : val.limit - (spends?.[key] ?? 0)}
                </td>
              </tr>
            </>
          ))}
        </table>
      </div>
    </div>
  );
}

export default React.memo(BudgetSection);
