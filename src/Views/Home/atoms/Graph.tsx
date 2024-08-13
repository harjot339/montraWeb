import React, { useCallback, useState } from 'react';
// Third Party Libraries
import { Timestamp } from 'firebase/firestore';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
// Custom Components
import CustomDropdown from '../../../Components/CustomDropdown';
import { TransactionType } from '../../../Defs/transaction';
import { COLORS } from '../../../Shared/commonStyles';
import { currencies, STRINGS } from '../../../Shared/Strings';
import useAppTheme from '../../../Hooks/themeHook';
import { formatAMPM, formatWithCommas } from '../../../Utils/commonFuncs';
import { RootState } from '../../../Store';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Graph({
  data,
  month,
  hideDropdown = false,
  type = 'expense',
}: Readonly<{
  data: TransactionType[];
  month: number;
  hideDropdown?: boolean;
  type?: 'expense' | 'income';
}>) {
  // redux
  const currency = useSelector(
    (state: RootState) => state.common.user?.currency
  );
  // constants
  const [theme] = useAppTheme();
  const startOfToday = new Date().setHours(0, 0, 0, 0) / 1000;
  const startOfWeek = Math.floor(
    (new Date().setHours(0, 0, 0, 0) - new Date().getDay() * 86400000) / 1000
  );
  const startOfYear = Math.floor(
    new Date(new Date().setMonth(0, 1)).setHours(0, 0, 0, 0) / 1000
  );
  // state
  const [graphDay, setGraphDay] = useState<number>(0);
  // functions
  const graphData = data
    .filter((item) => {
      if (!hideDropdown) {
        if (graphDay === 0) {
          return (
            item.timeStamp.seconds >= startOfToday &&
            (type === 'expense'
              ? item.type === 'expense' || item.type === 'transfer'
              : item.type === 'income')
          );
        }
        if (graphDay === 1) {
          return (
            item.timeStamp.seconds >= startOfWeek &&
            (type === 'expense'
              ? item.type === 'expense' || item.type === 'transfer'
              : item.type === 'income')
          );
        }
        if (graphDay === 2) {
          return (
            Timestamp.fromMillis(item.timeStamp.seconds * 1000)
              .toDate()
              .getMonth() === month &&
            (type === 'expense'
              ? item.type === 'expense' || item.type === 'transfer'
              : item.type === 'income')
          );
        }
        if (graphDay === 3) {
          return (
            item.timeStamp.seconds >= startOfYear &&
            (type === 'expense'
              ? item.type === 'expense' || item.type === 'transfer'
              : item.type === 'income')
          );
        }
      }
      return (
        Timestamp.fromMillis(item.timeStamp.seconds * 1000)
          .toDate()
          .getMonth() === month &&
        (type === 'expense'
          ? item.type === 'expense' || item.type === 'transfer'
          : item.type === 'income')
      );
    })
    .sort((a, b) => a.timeStamp.seconds - b.timeStamp.seconds)
    .reduce(
      (acc: { data: number[]; labels: number[] }, item) => {
        acc.data.push(
          item.amount * item.conversion.usd[currency?.toLowerCase() ?? 'usd']
        );
        acc.labels.push(item.timeStamp.seconds);
        return acc;
      },
      { data: [], labels: [] }
    );
  const formatDate = useCallback(
    (item: number) => {
      if (graphDay === 0 && !hideDropdown) {
        return formatAMPM(Timestamp.fromMillis(item).toDate());
      }
      return `${Timestamp.fromMillis(item)
        .toDate()
        .getDay()}/${Timestamp.fromMillis(item)
        .toDate()
        .getMonth()}/${Timestamp.fromMillis(item).toDate().getFullYear()}`;
    },
    [graphDay, hideDropdown]
  );
  return (
    <div
      className={clsx(
        'flex flex-col rounded-lg ',
        theme === 'dark' ? 'bg-black' : 'bg-white',
        hideDropdown && 'pt-4'
      )}
    >
      {!hideDropdown && (
        <div className="flex justify-between px-4 py-2 items-center gap-y-2">
          <p
            className={clsx(
              'text-1xl md:text-2xl lg:text-3xl font-bold',
              theme === 'dark' && 'text-white'
            )}
          >
            {STRINGS.SpendFrequency}
          </p>
          <div className="max-w-40 min-w-[120px]">
            <CustomDropdown
              onChange={(e) => {
                setGraphDay(Number(e!.value));
              }}
              data={[
                STRINGS.Today,
                STRINGS.Week,
                STRINGS.Month,
                STRINGS.Year,
              ].map((item, i) => {
                return { label: item, value: i };
              })}
              placeholder=""
              value={
                graphDay !== undefined
                  ? {
                      value: graphDay,
                      label: [
                        STRINGS.Today,
                        STRINGS.Week,
                        STRINGS.Month,
                        STRINGS.Year,
                      ][graphDay],
                    }
                  : undefined
              }
            />
          </div>
        </div>
      )}
      <div className="h-96 w-full">
        {graphData.data.length < 2 ? (
          <div className="flex w-full h-full justify-center items-center">
            <p className="text-gray-400 text-xl">{STRINGS.NotEnoughData}</p>
          </div>
        ) : (
          <Line
            data={{
              labels: graphData.labels,
              datasets: [
                {
                  data: graphData.data,
                  backgroundColor: [COLORS.VIOLET[20]],
                  borderColor: COLORS.VIOLET[100],
                  borderWidth: 4,
                  pointRadius: 0,
                  fill: 'start',
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              responsive: true,
              elements: { line: { tension: 0.4 } },
              layout: { padding: 0 },
              plugins: {
                filler: {
                  propagate: false,
                },
                legend: { display: false },
                tooltip: {
                  displayColors: false,
                  callbacks: {
                    title: (context) =>
                      formatDate(Number(context[0].label) * 1000),
                    label: (context) => {
                      const val = context.raw as string;
                      return (
                        currencies[currency ?? 'USD'].symbol +
                        formatWithCommas(Number(val).toFixed(2).toString())
                      );
                    },
                  },
                },
              },
              interaction: {
                intersect: false,
              },
              scales: {
                x: {
                  display: false,
                },
                y: { display: false, offset: true },
              },
            }}
          />
        )}
      </div>
    </div>
  );
}

export default React.memo(Graph);
