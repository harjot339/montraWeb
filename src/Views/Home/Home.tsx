import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store';
import { COLORS } from '../../Shared/commonStyles';

function Home() {
  const [month, setMonth] = useState(new Date().getMonth());
  setMonth(month);
  const spends = useSelector(
    (state: RootState) => state.common.user?.spend?.[month]
  );
  const incomes = useSelector(
    (state: RootState) => state.common.user?.income?.[month]
  );
  const totalSpend = Object.values(spends ?? []).reduce((a, b) => a + b, 0);
  const totalIncome = Object.values(incomes ?? []).reduce((a, b) => a + b, 0);
  //   const user = useSelector((state: RootState) => state.common.user);
  return (
    <div className="sm:ml-64 pt-4 px-4">
      <p className="text-4xl font-semibold mb-6">Home</p>
      <div className="flex gap-3 flex-wrap">
        <div className="flex flex-col flex-1 gap-2 min-w-56">
          <div className="rounded-lg bg-white py-6 px-4">
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold">
              Overview
            </p>
            <div className="flex mt-5 justify-evenly gap-3 text-center">
              <div className="">
                <p className="text-xl md:text-2xl lg:text-3xl font-semibold">
                  $9400
                </p>
                <p
                  className="text-md md:text-lg font-normal"
                  style={{ color: COLORS.DARK[25] }}
                >
                  Account Balance
                </p>
              </div>
              <div className="">
                <p className="text-xl md:text-2xl lg:text-3xl font-semibold">
                  ${totalSpend}
                </p>
                <p
                  className="text-md md:text-lg font-normal"
                  style={{ color: COLORS.DARK[25] }}
                >
                  Expense
                </p>
              </div>
              <div className="">
                <p className="text-xl md:text-2xl lg:text-3xl font-semibold">
                  ${totalIncome}
                </p>
                <p
                  className="text-md md:text-lg font-normal"
                  style={{ color: COLORS.DARK[25] }}
                >
                  Income
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-lg bg-white">sds</div>
        </div>
        <div className="rounded-lg min-w-56 flex-1 bg-white">sds</div>
      </div>
    </div>
  );
}

export default Home;
