import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ReactApexChart from 'react-apexcharts';
import { Timestamp } from 'firebase/firestore';
import ProgressBar from '@ramonak/react-progress-bar';
import { currencies, monthData, STRINGS } from '../../Shared/Strings';
import Graph from '../Home/atoms/Graph';
import { RootState } from '../../Store';
import CustomDropdown from '../../Components/CustomDropdown';
import CustomButton from '../../Components/CustomButton';
import ExportDataModal from './atoms/ExportDataModal';
import TransactionListItem from '../../Components/TransactionListItem';
import { formatWithCommas, getMyColor } from '../../Utils/commonFuncs';
import { COLORS } from '../../Shared/commonStyles';

function FinancialReport() {
  const [month, setMonth] = useState(new Date().getMonth());
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const data = useSelector(
    (state: RootState) => state.transactions.transactions
  );
  const spends = useSelector(
    (state: RootState) => state.common.user?.spend[month]
  );
  const totalSpend = Object.values(spends ?? {}).reduce(
    (acc, curr) => acc + curr,
    0
  );
  const income = useSelector(
    (state: RootState) => state.common.user?.income[month]
  );
  const totalIncome = Object.values(income ?? {}).reduce(
    (acc, curr) => acc + curr,
    0
  );
  const conversion = useSelector((state: RootState) => state.common.conversion);
  const currency = useSelector(
    (state: RootState) => state.common.user?.currency
  );
  const [modal, setModal] = useState<boolean>(false);
  return (
    <div className="sm:ml-48 pt-4 px-4">
      <ExportDataModal modal={modal} setModal={setModal} />
      <div className="flex justify-between mb-6 items-center">
        <p className="text-4xl font-semibold">{STRINGS.FinancialReport}</p>
        <div className="flex gap-x-8">
          <div className="flex w-72">
            <CustomButton
              flex={1}
              title={STRINGS.ExportData}
              onPress={() => {
                setModal(true);
              }}
            />
          </div>
          <CustomDropdown
            borderColor="#00000040"
            data={[
              { label: 'Expense', value: 'expense' },
              { label: 'Income', value: 'income' },
            ]}
            placeholder={STRINGS.Type}
            onChange={(e) => {
              setType(e.target.value as 'income' | 'expense');
            }}
            value={type}
          />
          <CustomDropdown
            borderColor="#00000040"
            data={monthData}
            placeholder={STRINGS.Month}
            onChange={(e) => {
              setMonth(Number(e.target.value) - 1);
            }}
            value={month + 1}
          />
        </div>
      </div>
      <div className="rounded-lg flex bg-white py-4 px-4">
        <div className="w-1/2">
          <div className="h-96">
            <Graph data={data} month={month} hideDropdown type={type} />
          </div>
          <div className="px-2">
            {data
              .slice()
              .filter((item) => {
                return (
                  Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                    .toDate()
                    ?.getMonth() === month && item.type === type
                );
              })
              .sort((a, b) => b.timeStamp.seconds - a.timeStamp.seconds)
              .map((item) => (
                <TransactionListItem
                  disabled
                  item={item}
                  key={item.id}
                  width="full"
                  currency={currency}
                  conversion={conversion}
                />
              ))}
          </div>
        </div>
        <div className="w-1/2 flex flex-col items-center">
          <div className="h-96 justify-center flex items-center">
            <ReactApexChart
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
                          fontSize: '48px',
                          fontWeight: '700',
                        },
                        total: {
                          showAlways: true,
                          show: true,
                        },
                      },
                    },
                  },
                },
                legend: { show: false },
                labels: Object.keys(spends ?? {}).reduce(
                  (acc: string[], curr) => {
                    acc.push(curr[0].toUpperCase() + curr.slice(1));
                    return acc;
                  },
                  []
                ),
              }}
            />
          </div>
          {Object.entries((type === 'income' ? income : spends) ?? {})
            .sort((a, b) => b[1] - a[1])
            .map((item) => {
              const color = getMyColor();
              return (
                <div className="flex flex-col px-6 py-4 w-full" key={item[0]}>
                  <div className="flex w-full justify-between items-center mb-4">
                    <div className="flex items-center gap-x-3 justify-between px-5 py-2 rounded-3xl border">
                      <div
                        className="w-5 h-5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <p>{item[0][0].toUpperCase() + item[0].slice(1)}</p>
                    </div>
                    <p
                      className="text-2xl font-semibold"
                      style={{
                        color:
                          type === 'expense'
                            ? COLORS.RED[100]
                            : COLORS.GREEN[100],
                      }}
                    >
                      {type === 'expense' ? '- ' : '+ '}
                      {currencies[currency!].symbol}
                      {formatWithCommas(
                        Number(
                          (
                            conversion.usd[currency!.toLowerCase()] * item[1]
                          ).toFixed(1)
                        ).toString()
                      )}
                    </p>
                  </div>
                  <ProgressBar
                    completed={(
                      (item[1] /
                        (type === 'expense'
                          ? Number(totalSpend)
                          : Number(totalIncome))) *
                      100
                    ).toFixed(0)}
                    // maxCompleted={
                    //   type === 'expense'
                    //     ? Number(totalSpend)
                    //     : Number(totalIncome)
                    // }
                    bgColor={color}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default React.memo(FinancialReport);
