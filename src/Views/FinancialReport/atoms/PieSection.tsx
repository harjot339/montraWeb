import ProgressBar from '@ramonak/react-progress-bar';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
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
  conversion,
  currency,
  totalSpend,
  totalIncome,
  setType,
}: Readonly<{
  type: 'income' | 'expense';
  income:
    | {
        [key: string]: number;
      }
    | undefined;
  spends:
    | {
        [key: string]: number;
      }
    | undefined;
  theme: 'light' | 'dark';
  conversion: {
    [key: string]: {
      [key: string]: number;
    };
  };
  currency: string | undefined;
  totalSpend: number;
  totalIncome: number;
  setType: React.Dispatch<React.SetStateAction<'income' | 'expense'>>;
}>) {
  const isDesktop = useIsDesktop();
  const [catColors, setCatColors] = useState<{ [key: string]: string }>();
  const data = Object.entries((type === 'income' ? income : spends) ?? {})
    .sort((a, b) => a[1] - b[1])
    .reduce(
      (acc: { data: number[]; labels: string[] }, curr) => {
        acc.data.push(curr[1]);
        acc.labels.push(curr[0][0].toUpperCase() + curr[0].slice(1));
        return acc;
      },
      { data: [], labels: [] }
    );
  useEffect(() => {
    setCatColors(
      Object.entries(type === 'expense' ? spends ?? {} : income ?? {})
        .sort((a, b) => a[1] - b[1])
        .reduce((acc: { [key: string]: string }, item) => {
          acc[item[0]] = getMyColor();
          return acc;
        }, {})
    );
    return () => {
      setCatColors(undefined);
    };
  }, [income, spends, type]);
  return (
    <div className="flex flex-col items-center">
      <div className="h-96 justify-center flex items-center">
        <Doughnut
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
                      (
                        conversion.usd[currency!.toLowerCase()] *
                        Number(
                          chart.data.datasets[0].data
                            .reduce((acc, curr) => acc + curr, 0)
                            .toFixed(2)
                        )
                      ).toFixed(2)
                    ).toString()
                  );
                const textX = Math.round(
                  (width - ctx.measureText(text).width) / 2
                );
                const textY = height / 2;
                ctx.fillText(text, textX, textY);
                ctx.save();
              },
              id: '',
            },
          ]}
          options={{
            cutout: '70%',
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const val = context.raw as number;
                    return (
                      currencies[currency ?? 'USD'].symbol +
                      formatWithCommas(
                        Number(
                          (
                            conversion.usd[currency!.toLowerCase()] *
                            Number(val)
                          ).toFixed(2)
                        ).toString()
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
        {/* <ReactApexChart
          series={Object.values((type === 'income' ? income : spends) ?? {})
            .reduce((acc: number[], curr) => {
              acc.push(curr);
              return acc;
            }, [])
            .sort((a, b) => a - b)}
          width="400px"
          type="donut"
          options={{
            chart: {
              type: 'donut',
            },
            dataLabels: { enabled: false },
            fill: {
              type: 'gradient',
            },
            plotOptions: {
              pie: {
                donut: {
                  size: '75%',
                  labels: {
                    show: true,
                    name: { show: false },
                    value: {
                      show: true,
                      fontSize: '36px',
                      fontWeight: '700',
                      color: theme === 'dark' ? 'white' : 'black',
                    },
                    total: {
                      showAlways: true,
                      show: true,
                      formatter: (w) => {
                        return (
                          currencies[currency ?? 'USD'].symbol +
                          w.globals.series
                            .reduce(
                              (acc: number, curr: number) => acc + curr,
                              0
                            )
                            .toFixed(2)
                        );
                      },
                    },
                  },
                },
              },
            },
            noData: { text: STRINGS.NotEnoughData },
            legend: { show: false },
            labels: Object.keys(spends ?? {}).reduce((acc: string[], curr) => {
              acc.push(curr[0].toUpperCase() + curr.slice(1));
              return acc;
            }, []),
          }}
        /> */}
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
      {Object.entries((type === 'income' ? income : spends) ?? {})
        .sort((a, b) => b[1] - a[1])
        .map((item) => {
          return (
            <div
              className="flex flex-col px-1 sm:px-6 py-4 w-full"
              key={item[0]}
            >
              <div className="flex w-full justify-between items-center mb-4">
                <div className="flex items-center gap-x-3 justify-between px-5 py-2 rounded-3xl border">
                  <div
                    className="w-5 h-5 rounded-full"
                    style={{ backgroundColor: catColors?.[item[0]] ?? 'green' }}
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
                    color:
                      type === 'expense' ? COLORS.RED[100] : COLORS.GREEN[100],
                  }}
                >
                  {type === 'expense' ? '- ' : '+ '}
                  {currencies[currency!].symbol}
                  {formatWithCommas(
                    Number(
                      (
                        conversion.usd[currency!.toLowerCase()] * item[1]
                      ).toFixed(2)
                    ).toString()
                  )}
                </p>
              </div>
              <ProgressBar
                isLabelVisible={false}
                completed={(
                  (item[1] /
                    (type === 'expense'
                      ? Number(totalSpend)
                      : Number(totalIncome))) *
                  100
                ).toFixed(0)}
                bgColor={catColors?.[item[0]] ?? 'green'}
              />
            </div>
          );
        })}
    </div>
  );
}

export default React.memo(PieSection);
