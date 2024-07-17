import React, { useState } from 'react';
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
import { TransactionType } from '../../../Defs/transaction';
import { COLORS } from '../../../Shared/commonStyles';
import { currencies, STRINGS } from '../../../Shared/Strings';
import useAppTheme from '../../../Hooks/themeHook';
import CustomDropdown from '../../../Components/CustomDropdown';
import { formatWithCommas } from '../../../Utils/commonFuncs';
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
  const conversion = useSelector((state: RootState) => state.common.conversion);
  const currency = useSelector(
    (state: RootState) => state.common.user?.currency
  );
  const startOfToday = new Date().setHours(0, 0, 0, 0) / 1000;
  const startOfWeek = Math.floor(
    (new Date().setHours(0, 0, 0, 0) - new Date().getDay() * 86400000) / 1000
  );
  const [graphDay, setGraphDay] = useState<number>(0);
  const startOfYear = Math.floor(
    new Date(new Date().setMonth(0, 1)).setHours(0, 0, 0, 0) / 1000
  );
  const graphData = data
    .filter((item) => {
      if (!hideDropdown) {
        if (graphDay === 0) {
          return item.timeStamp.seconds >= startOfToday && item.type === type;
        }
        if (graphDay === 1) {
          return item.timeStamp.seconds >= startOfWeek && item.type === type;
        }
        if (graphDay === 2) {
          return (
            Timestamp.fromMillis(item.timeStamp.seconds * 1000)
              .toDate()
              .getMonth() === month && item.type === type
          );
        }
      }
      return item.timeStamp.seconds >= startOfYear && item.type === type;
    })
    .sort((a, b) => a.timeStamp.seconds - b.timeStamp.seconds)
    .reduce(
      (acc: { data: number[]; labels: number[] }, item) => {
        acc.data.push(item.amount);
        acc.labels.push(item.timeStamp.seconds);
        return acc;
      },
      { data: [], labels: [] }
    );
  const [theme] = useAppTheme();
  return (
    <div
      className={clsx(
        'flex flex-col rounded-lg ',
        theme === 'dark' ? 'bg-black' : 'bg-white'
      )}
    >
      {!hideDropdown && (
        <div className="self-end px-3 py-2">
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
      )}
      <div className="h-96 w-full">
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
                fill: 'origin',
              },
            ],
          }}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            elements: { line: { tension: 0.4 } },
            plugins: {
              filler: {
                propagate: false,
              },
              legend: { display: false },
              tooltip: {
                displayColors: false,
                callbacks: {
                  title: (context) =>
                    Timestamp.fromMillis(Number(context[0].label) * 1000)
                      .toDate()
                      .toLocaleDateString(),
                  label: (context) => {
                    const val = context.raw as string;
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
            interaction: {
              intersect: false,
            },
            scales: {
              x: {
                display: false,
              },
              y: { display: false },
            },
          }}
        />
      </div>
      {/* <ReactApexChart
        options={{
          chart: {
            toolbar: { show: false },
            type: 'area',
            zoom: {
              enabled: false,
            },
          },
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: 'smooth',
          },
          xaxis: {
            type: 'category',
            // categories: ['1'],
            // type: 'datetime',
            // axisTicks: { show: false },
            // axisBorder: { show: false },
            // type: 'numeric',
            // tickAmount: graphData.length,
            labels: {
              // show: false,
              // formatter(value) {
              //   return Timestamp.fromMillis(Number(value) * 1000)
              //     .toDate()
              //     .toLocaleDateString();
              // },
            },
          },
          yaxis: {
            axisTicks: { show: false },
            axisBorder: { show: false },
            labels: { show: false },
          },
          tooltip: {
            custom({ series, seriesIndex, dataPointIndex }) {
              return `<p style="padding:2px 5px; font-size:18px">$ ${series[seriesIndex][dataPointIndex]}</p>`;
            },
          },
          noData: { text: 'Not enough data' },
          colors: [COLORS.VIOLET[100]],
          grid: { show: false },
          fill: {
            type: 'gradient',
            gradient: {
              shade: 'yellow',
              shadeIntensity: 1,
              opacityFrom: 0.7,
              opacityTo: 0.9,
              stops: [0, 100],
            },
          },
        }}
        series={[
          {
            data: graphData,
          },
        ]}
        type="area"
        height={350}
      /> */}
    </div>
  );
}

export default React.memo(Graph);
