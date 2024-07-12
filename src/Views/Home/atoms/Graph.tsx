import ReactApexChart from 'react-apexcharts';
import React, { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { TransactionType } from '../../../Defs/transaction';
import { COLORS } from '../../../Shared/commonStyles';

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
    .map((item) => {
      return {
        y: item.amount,
        x: item.timeStamp.seconds,
      };
    });
  //   console.log(graphData)
  return (
    <div className="flex flex-col">
      {!hideDropdown && (
        <select
          value={graphDay}
          className="border rounded-xl py-2 px-3 my-3 mx-3 self-end"
          onChange={(e) => {
            setGraphDay(Number(e.target.value));
          }}
        >
          <option key={0} value={0}>
            Today
          </option>
          <option key={1} value={1}>
            Week
          </option>
          <option key={2} value={2}>
            Month
          </option>
          <option key={3} value={3}>
            Year
          </option>
        </select>
      )}
      <ReactApexChart
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
            type: 'datetime',
            axisTicks: { show: false },
            axisBorder: { show: false },
            labels: {
              show: false,
              formatter(value) {
                return Timestamp.fromMillis(Number(value) * 1000)
                  .toDate()
                  .toLocaleDateString();
              },
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
      />
    </div>
  );
}

export default React.memo(Graph);
