import React, { useState } from 'react';
// Third Party Libraries
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
// Custom Components
import BudgetItem from './atoms/BudgetItem';
import CustomButton from '../../Components/CustomButton';
import CreateBudget from '../CreateBudget';
import SidebarButton from '../../Components/SidebarButton';
import { monthData, STRINGS } from '../../Shared/Strings';
import { RootState } from '../../Store';
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown';
import useAppTheme from '../../Hooks/themeHook';
import {
  useIsMobile,
  useIsTablet,
  useIsDesktop,
} from '../../Hooks/mobileCheckHook';

function Budgets() {
  const navigate = useNavigate();
  const params = useParams();
  const [theme] = useAppTheme();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  // state
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  // redux
  const budgets = useSelector(
    (state: RootState) => state.common.user?.budget[month]
  );
  const currency = useSelector(
    (state: RootState) => state.common.user?.currency
  );
  const expenseColors = useSelector(
    (state: RootState) => state.common.user?.expenseColors
  );
  const spend =
    useSelector((state: RootState) => state.common.user?.spend[month]) ?? {};
  return (isTablet || isMobile) && params?.id !== undefined ? (
    <div className={clsx(isTablet && 'ml-52')}>
      <Outlet />
    </div>
  ) : (
    <div>
      {isOpen && !isDesktop ? (
        <div className="sm:ml-52">
          <CreateBudget setIsOpen={setIsOpen} isEdit={isEdit} />
        </div>
      ) : (
        <div className="sm:ml-48 pt-4 px-4 flex">
          <div className="w-full mr-4">
            <div className="flex gap-x-3 sm:justify-between flex-wrap w-full items-center mb-3">
              <SidebarButton />
              <p
                className={clsx(
                  'text-3xl sm:text-4xl font-bold my-4',
                  theme === 'dark' && 'text-white'
                )}
              >
                {STRINGS.Budget}
              </p>
              <div className="flex justify-between w-full sm:w-fit gap-x-4">
                {!isOpen &&
                  params?.id === undefined &&
                  month === new Date().getMonth() && (
                    <div className="flex min-w-40 md:min-w-80">
                      <CustomButton
                        flex={1}
                        onPress={() => {
                          setIsEdit(false);
                          setIsOpen(true);
                        }}
                        title={STRINGS.CreateABudget}
                      />
                    </div>
                  )}
                <CustomDropdown
                  data={monthData(STRINGS).slice(0, new Date().getMonth() + 1)}
                  value={
                    month !== undefined ? monthData(STRINGS)[month] : undefined
                  }
                  onChange={(e) => {
                    setMonth(Number(e!.value) - 1);
                  }}
                  placeholder={STRINGS.Month}
                />
              </div>
            </div>
            <div className="flex gap-4 flex-wrap">
              {Object.entries(budgets ?? {}).length === 0 ? (
                <div
                  className="flex w-full justify-center items-center"
                  style={{ height: '50vh' }}
                >
                  <p className="text-gray-400 text-xl">
                    {month < new Date().getMonth()
                      ? STRINGS.NoBudgetForThisMonth
                      : STRINGS.NoBudget}
                  </p>
                </div>
              ) : (
                Object.entries(budgets ?? {})
                  .sort((a, b) => {
                    if (a[0] < b[0]) {
                      return -1;
                    }
                    if (a[0] > b[0]) {
                      return 1;
                    }
                    return 0;
                  })
                  .map((item) => {
                    return (
                      <BudgetItem
                        color={expenseColors?.[item[0]] ?? 'green'}
                        onClick={() => {
                          if (`${month}_${item[0]}` !== params?.id)
                            navigate(`${month}_${item[0]}`, {
                              replace: params?.id !== undefined,
                            });
                        }}
                        key={item[0]}
                        item={item}
                        // conversion={conversion}
                        currency={currency}
                        spend={spend}
                      />
                    );
                  })
              )}
            </div>
          </div>
          <Outlet />
          {isOpen && isDesktop && (
            <CreateBudget setIsOpen={setIsOpen} isEdit={isEdit} />
          )}
        </div>
      )}
    </div>
  );
}

export default React.memo(Budgets);
