import React, { useEffect, useState } from 'react';
// Third Party Libraries
import clsx from 'clsx';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js';
// Custom Components
import CategoryItem from './CategoryItem';
import { COLORS } from '../../../Shared/commonStyles';
import { STRINGS, currencies } from '../../../Shared/Strings';
import { getMyColor, formatWithCommas } from '../../../Utils/commonFuncs';
import { useIsDesktop } from '../../../Hooks/mobileCheckHook';

ChartJS.register(CategoryScale, Title, Tooltip, Legend, Filler, ArcElement);

function PieSection({
  type,
  income,
  spends,
  theme,
  currency,
  totalSpend,
  totalIncome,
  setType,
}: Readonly<{
  type: 'income' | 'expense';
  income:
    | {
        [category: string]: {
          [currency: string]: number;
        };
      }
    | undefined;
  spends:
    | {
        [category: string]: {
          [currency: string]: number;
        };
      }
    | undefined;
  theme: 'light' | 'dark';
  currency: string | undefined;
  totalSpend: number;
  totalIncome: number;
  setType: React.Dispatch<React.SetStateAction<'income' | 'expense'>>;
}>) {
  const isDesktop = useIsDesktop();
  const [catColors, setCatColors] = useState<{ [key: string]: string }>();
  const [sort, setSort] = useState<boolean>(false);
  const data = Object.entries((type === 'income' ? income : spends) ?? {})
    .sort((a, b) => b[1][currency ?? 'USD'] - a[1][currency ?? 'USD'])
    .reduce(
      (acc: { data: number[]; labels: string[] }, curr) => {
        acc.data.push(curr[1][currency ?? 'USD']);
        acc.labels.push(curr[0][0].toUpperCase() + curr[0].slice(1));
        return acc;
      },
      { data: [], labels: [] }
    );
  useEffect(() => {
    setCatColors(
      Object.entries(type === 'expense' ? spends ?? {} : income ?? {})
        .sort((a, b) => b[1][currency ?? 'USD'] - a[1][currency ?? 'USD'])
        .reduce((acc: { [key: string]: string }, item) => {
          acc[item[0]] = getMyColor();
          return acc;
        }, {})
    );
    return () => {
      setCatColors(undefined);
    };
  }, [currency, income, spends, type]);
  return (
    <div className="flex flex-col items-center">
      <div className="h-96 justify-center flex items-center">
        {Object.values((type === 'income' ? income : spends) ?? {}).reduce(
          (acc, curr) => acc + curr[currency?.toUpperCase() ?? 'USD'],
          0
        ) === 0 ? (
          <div className="flex w-full h-full justify-center items-center">
            <p className="text-gray-400 text-xl">{STRINGS.NotEnoughData}</p>
          </div>
        ) : (
          <Doughnut
            key={currency}
            plugins={[
              {
                beforeDraw(chart) {
                  const { width } = chart;
                  const { height } = chart;
                  const { ctx } = chart;
                  ctx.restore();
                  const fontSize = (height / 160).toFixed(2);
                  ctx.font = `bold ${fontSize}em sans-serif`;
                  ctx.textBaseline = 'top';
                  const fontColor = COLORS.DARK[25];
                  ctx.fillStyle = fontColor;
                  const text =
                    currencies[currency ?? 'USD'].symbol +
                    formatWithCommas(
                      Number(
                        Number(
                          chart.data.datasets[0].data
                            .reduce((acc, curr) => acc + curr, 0)
                            .toFixed(2)
                        ).toFixed(2)
                      ).toString()
                    );
                  const textX = Math.round(
                    (width - ctx.measureText(text).width) / 2
                  );
                  const textY = height / 2 - 10;
                  ctx.fillText(text, textX, textY);
                  ctx.save();
                },
                id: '',
              },
            ]}
            options={{
              cutout: '75%',
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const val = context.raw as number;
                      return (
                        currencies[currency ?? 'USD'].symbol +
                        formatWithCommas(
                          Number(Number(val).toFixed(2)).toString()
                        )
                      );
                    },
                  },
                },
              },
            }}
            data={{
              datasets: [
                {
                  data: data.data,
                  backgroundColor: Object.values(catColors ?? {}),
                },
              ],
              labels: data.labels,
            }}
          />
        )}
      </div>
      {!isDesktop && (
        <div
          className={clsx(
            'flex w-full h-14 px-2 justify-center items-center rounded-3xl',
            theme === 'dark' ? `bg-[#161719]` : 'bg-gray-100'
          )}
        >
          <div className="flex rounded-3xl h-11 w-full ">
            <button
              type="button"
              onClick={() => {
                setType('expense');
              }}
              className={clsx(
                'flex flex-1 justify-center items-center rounded-3xl',
                type === 'expense'
                  ? 'bg-[#7F3DFF] text-white'
                  : 'bg-transparent',
                theme === 'dark' && 'text-white'
              )}
            >
              {STRINGS.Expense}
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
              }}
              className={clsx(
                'flex flex-1 justify-center items-center rounded-3xl',
                type === 'income'
                  ? 'bg-[#7F3DFF] text-white'
                  : 'bg-transparent',
                theme === 'dark' && 'text-white'
              )}
            >
              {STRINGS.Income}
            </button>
          </div>
        </div>
      )}
      {Object.entries((type === 'income' ? income : spends) ?? {}).length !==
        0 &&
        Object.values((type === 'income' ? income : spends) ?? {}).reduce(
          (acc, curr) => acc + curr[currency?.toUpperCase() ?? 'USD'],
          0
        ) !== 0 && (
          <>
            <div className="flex justify-between w-full px-1 sm:px-6 pt-7">
              <p
                className={clsx(
                  'text-2xl md:text-3xl lg:text-4xl font-bold mb-4 items-center',
                  theme === 'dark' && 'text-white'
                )}
              >
                {STRINGS.Categories}
              </p>
              <button
                type="button"
                className="border h-10 w-10 flex justify-center items-center rounded-lg bg-transparent outline-none"
                style={{
                  transform: sort
                    ? 'rotateY(180deg) rotateZ(180deg)'
                    : 'rotateY(0deg)',
                }}
                onClick={() => {
                  setSort((s) => !s);
                }}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M27 9H15C14.7348 9 14.4804 8.89464 14.2929 8.70711C14.1054 8.51957 14 8.26522 14 8C14 7.73478 14.1054 7.48043 14.2929 7.29289C14.4804 7.10536 14.7348 7 15 7H27C27.2652 7 27.5196 7.10536 27.7071 7.29289C27.8946 7.48043 28 7.73478 28 8C28 8.26522 27.8946 8.51957 27.7071 8.70711C27.5196 8.89464 27.2652 9 27 9Z"
                    fill={theme === 'dark' ? 'white' : 'black'}
                  />
                  <path
                    d="M21 17H15C14.7348 17 14.4804 16.8946 14.2929 16.7071C14.1054 16.5196 14 16.2652 14 16C14 15.7348 14.1054 15.4804 14.2929 15.2929C14.4804 15.1054 14.7348 15 15 15H21C21.2652 15 21.5196 15.1054 21.7071 15.2929C21.8946 15.4804 22 15.7348 22 16C22 16.2652 21.8946 16.5196 21.7071 16.7071C21.5196 16.8946 21.2652 17 21 17Z"
                    fill={theme === 'dark' ? 'white' : 'black'}
                  />
                  <path
                    d="M17 25H15C14.7348 25 14.4804 24.8946 14.2929 24.7071C14.1054 24.5196 14 24.2652 14 24C14 23.7348 14.1054 23.4804 14.2929 23.2929C14.4804 23.1054 14.7348 23 15 23H17C17.2652 23 17.5196 23.1054 17.7071 23.2929C17.8946 23.4804 18 23.7348 18 24C18 24.2652 17.8946 24.5196 17.7071 24.7071C17.5196 24.8946 17.2652 25 17 25Z"
                    fill={theme === 'dark' ? 'white' : 'black'}
                  />
                  <path
                    d="M11 7C10.7348 7 10.4804 7.10536 10.2929 7.29289C10.1054 7.48043 10 7.73478 10 8V22.45L5.71 18.15C5.5217 17.9617 5.2663 17.8559 5 17.8559C4.7337 17.8559 4.47831 17.9617 4.29 18.15C4.1017 18.3383 3.99591 18.5937 3.99591 18.86C3.99591 19.1263 4.1017 19.3817 4.29 19.57L8.88 24.16C9.44856 24.7081 10.2103 25.01 11 25C11.2652 25 11.5196 24.8946 11.7071 24.7071C11.8946 24.5196 12 24.2652 12 24V8C12 7.73478 11.8946 7.48043 11.7071 7.29289C11.5196 7.10536 11.2652 7 11 7Z"
                    fill={theme === 'dark' ? 'white' : 'black'}
                  />
                </svg>
              </button>
            </div>
            <div
              className="overflow-scroll w-full overflow-x-hidden"
              style={{ height: '450px' }}
            >
              {Object.entries((type === 'income' ? income : spends) ?? {})
                .sort((a, b) => {
                  if (sort) {
                    return a[1][currency ?? 'USD'] - b[1][currency ?? 'USD'];
                  }
                  return b[1][currency ?? 'USD'] - a[1][currency ?? 'USD'];
                })
                .map(
                  (item) =>
                    item[1][currency?.toUpperCase() ?? 'USD'] !== 0 && (
                      <CategoryItem
                        catColors={catColors}
                        currency={currency}
                        item={item}
                        theme={theme}
                        totalIncome={totalIncome}
                        totalSpend={totalSpend}
                        type={type}
                        key={item[0]}
                      />
                    )
                )}
            </div>
          </>
        )}
    </div>
  );
}

export default React.memo(PieSection);
