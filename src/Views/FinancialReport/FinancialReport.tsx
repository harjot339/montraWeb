import React, { useState } from 'react';
// Third Party Libraries
import { useSelector } from 'react-redux';
import { Timestamp } from 'firebase/firestore';
import clsx from 'clsx';
// Custom Components
import CustomDropdown from '../../Components/CustomDropdown';
import CustomButton from '../../Components/CustomButton';
import ExportDataModal from './atoms/ExportDataModal';
import SidebarButton from '../../Components/SidebarButton';
import { monthData, STRINGS } from '../../Shared/Strings';
import { RootState } from '../../Store';
import useAppTheme from '../../Hooks/themeHook';
import PieSection from './atoms/PieSection';
import GraphSection from './atoms/GraphSection';
import { useIsDesktop } from '../../Hooks/mobileCheckHook';

function FinancialReport() {
  // constants
  const [theme] = useAppTheme();
  const isDesktop = useIsDesktop();
  // state
  const [month, setMonth] = useState(new Date().getMonth());
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [modal, setModal] = useState<boolean>(false);
  const [graph, setGraph] = useState<'line' | 'pie'>('line');
  // redux
  const data = useSelector(
    (state: RootState) => state.transactions.transactions
  );
  const spends = useSelector(
    (state: RootState) => state.common.user?.spend[month]
  );
  const currency = useSelector(
    (state: RootState) => state.common.user?.currency
  );
  const totalSpend = Object.values(spends ?? []).reduce((a, b) => {
    return a + (b?.[currency?.toUpperCase() ?? 'USD'] ?? 0);
  }, 0);
  const income = useSelector(
    (state: RootState) => state.common.user?.income[month]
  );
  const totalIncome = Object.values(income ?? []).reduce((a, b) => {
    return a + (b[currency?.toUpperCase() ?? 'USD'] ?? 0);
  }, 0);
  return (
    <div className="sm:ml-48 py-4 px-4">
      <ExportDataModal modal={modal} setModal={setModal} />
      <div className="flex gap-x-3 sm:justify-between mb-6 items-center flex-wrap">
        <SidebarButton />
        <p
          className={clsx(
            'text-3xl sm:text-4xl font-bold my-4',
            theme === 'dark' && 'text-white'
          )}
        >
          {STRINGS.FinancialReport}
        </p>
        <div className="flex gap-x-5 w-full md:w-fit justify-between">
          <div className="flex w-56 sm:w-72 md:w-[480px] lg:w-[600px]">
            <CustomButton
              flex={1}
              title={STRINGS.ExportData}
              onPress={() => {
                setModal(true);
              }}
            />
          </div>
          {isDesktop && (
            <CustomDropdown
              data={[
                { label: STRINGS.Expense, value: 'expense' },
                { label: STRINGS.Income, value: 'income' },
              ]}
              placeholder={STRINGS.Type}
              onChange={(e) => {
                setType(e!.value as 'income' | 'expense');
              }}
              value={
                type === 'expense'
                  ? { label: STRINGS.Expense, value: 'expense' }
                  : { label: STRINGS.Income, value: 'income' }
              }
            />
          )}
          {/* <div className="flex w-full max-w-[0%]"> */}
          <CustomDropdown
            flex={1}
            data={monthData(STRINGS).slice(0, new Date().getMonth() + 1)}
            placeholder={STRINGS.Month}
            onChange={(e) => {
              setMonth(Number(e!.value) - 1);
            }}
            value={month !== undefined ? monthData(STRINGS)[month] : undefined}
          />
          {/* </div> */}
        </div>
      </div>
      <div
        className={clsx(
          'rounded-lg flex py-4 px-4',
          theme === 'dark' ? 'bg-black' : 'bg-white'
        )}
      >
        {isDesktop &&
          (data.filter(
            (item) =>
              Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                .toDate()
                .getMonth() === month &&
              (type === 'expense'
                ? item.type === 'expense' || item.type === 'transfer'
                : item.type === 'income')
          ).length < 2 &&
          Object.values((type === 'income' ? income : spends) ?? {}).reduce(
            (acc, curr) => acc + curr[currency?.toUpperCase() ?? 'USD'],
            0
          ) === 0 ? (
            <div className="flex w-full h-[500px] justify-center items-center">
              <p className="text-gray-400 text-2xl font-semibold">
                {STRINGS.NotEnoughData}
              </p>
            </div>
          ) : (
            <>
              <div className="w-1/2">
                <GraphSection
                  currency={currency}
                  data={data}
                  month={month}
                  type={type}
                  setType={setType}
                  theme={theme}
                />
              </div>
              <div className="w-1/2">
                <PieSection
                  currency={currency}
                  income={income}
                  spends={spends}
                  theme={theme}
                  totalIncome={totalIncome}
                  totalSpend={totalSpend}
                  type={type}
                  setType={setType}
                />
              </div>
            </>
          ))}
        {!isDesktop && (
          <div className="w-full">
            <div className="flex w-full justify-end">
              <div className="flex border rounded-lg h-11 w-24 ">
                <button
                  type="button"
                  onClick={() => {
                    setGraph('line');
                  }}
                  className={clsx(
                    'flex flex-1 justify-center items-center rounded-s-lg',
                    graph === 'line' ? 'bg-[#7F3DFF]' : 'bg-transparent'
                  )}
                >
                  <svg
                    width="28"
                    height="20"
                    viewBox="0 0 28 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M28 4C28 5.06087 27.5786 6.07828 26.8284 6.82843C26.0783 7.57857 25.0609 8 24 8C23.3473 8.00105 22.7046 7.83952 22.13 7.53L16.35 13.83C16.7712 14.4756 16.997 15.2291 17 16C17 17.0609 16.5786 18.0783 15.8284 18.8284C15.0783 19.5786 14.0609 20 13 20C11.9391 20 10.9217 19.5786 10.1716 18.8284C9.42143 18.0783 9 17.0609 9 16C8.99873 15.455 9.11469 14.9162 9.34 14.42L6.44 12.17C5.74271 12.7124 4.88338 13.0047 4 13C3.20888 13 2.43552 12.7654 1.77772 12.3259C1.11992 11.8864 0.607234 11.2616 0.304484 10.5307C0.00173312 9.79983 -0.0774802 8.99556 0.0768607 8.21964C0.231202 7.44371 0.612165 6.73098 1.17157 6.17157C1.73098 5.61216 2.44372 5.2312 3.21964 5.07686C3.99556 4.92252 4.79983 5.00173 5.53074 5.30448C6.26164 5.60723 6.88635 6.11992 7.32588 6.77772C7.76541 7.43552 8 8.20887 8 9C7.99851 9.54362 7.88622 10.0812 7.67 10.58L10.56 12.83C11.1693 12.3612 11.9009 12.0779 12.667 12.014C13.4332 11.9502 14.2015 12.1085 14.88 12.47L20.65 6.17C20.2288 5.52441 20.003 4.77085 20 4C20 2.93913 20.4214 1.92172 21.1716 1.17157C21.9217 0.421427 22.9391 0 24 0C25.0609 0 26.0783 0.421427 26.8284 1.17157C27.5786 1.92172 28 2.93913 28 4Z"
                      fill={graph === 'line' ? 'white' : 'gray'}
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGraph('pie');
                  }}
                  className={clsx(
                    'flex flex-1 justify-center items-center rounded-e-lg',
                    graph === 'pie' ? 'bg-[#7F3DFF]' : 'bg-transparent'
                  )}
                >
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M28 15H17V4C19.8412 4.22837 22.5083 5.46063 24.5239 7.47614C26.5394 9.49166 27.7716 12.1588 28 15Z"
                      fill={graph === 'pie' ? 'white' : 'gray'}
                    />
                    <path
                      d="M28 17C27.801 19.2756 26.9566 21.4471 25.566 23.2594C24.1754 25.0716 22.2965 26.4493 20.15 27.2306C18.0035 28.0119 15.6786 28.1643 13.4484 27.6699C11.2183 27.1755 9.1756 26.0549 7.56038 24.4396C5.94515 22.8244 4.82449 20.7817 4.33009 18.5516C3.83569 16.3214 3.98809 13.9965 4.76938 11.85C5.55067 9.7035 6.92839 7.82457 8.74065 6.43401C10.5529 5.04346 12.7244 4.19905 15 4V16C15 16.2652 15.1054 16.5196 15.2929 16.7071C15.4804 16.8946 15.7348 17 16 17H28Z"
                      fill={graph === 'pie' ? 'white' : 'gray'}
                    />
                  </svg>
                </button>
              </div>
            </div>
            {graph === 'line' ? (
              <div className="w-full">
                <GraphSection
                  currency={currency}
                  data={data}
                  month={month}
                  type={type}
                  setType={setType}
                  theme={theme}
                />
              </div>
            ) : (
              <div className="w-full">
                <PieSection
                  currency={currency}
                  income={income}
                  spends={spends}
                  theme={theme}
                  totalIncome={totalIncome}
                  totalSpend={totalSpend}
                  type={type}
                  setType={setType}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(FinancialReport);
