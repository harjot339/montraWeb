import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { monthData, STRINGS } from '../../Shared/Strings';
import { RootState } from '../../Store';
import BudgetItem from './atoms/BudgetItem';
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown';
import { COLORS } from '../../Shared/commonStyles';
import CustomButton from '../../Components/CustomButton';
import CreateBudget from '../CreateBudget';
import { getMyColor } from '../../Utils/commonFuncs';

function Budgets() {
  const navigate = useNavigate();
  const params = useParams();
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
  const conversion = useSelector((state: RootState) => state.common.conversion);
  const spend =
    useSelector((state: RootState) => state.common.user?.spend[month]) ?? {};
  return (
    <div className="sm:ml-48 pt-4 px-4 flex">
      <div className="w-full mr-4">
        <div className="flex justify-between w-full items-center mb-3">
          <p className="text-3xl sm:text-4xl font-bold my-4">
            {STRINGS.Budget}
          </p>
          <div className="flex gap-x-4">
            {!isOpen && params?.id === undefined && (
              <div className="flex min-w-80 ">
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
              borderColor={COLORS.LIGHT[20]}
              data={monthData}
              value={month + 1}
              onChange={(e) => {
                setMonth(Number(e.target.value) - 1);
              }}
              placeholder={STRINGS.Month}
            />
          </div>
        </div>
        <div className="flex gap-4 flex-wrap">
          {Object.entries(budgets ?? {}).map((item) => {
            const color = getMyColor();
            return (
              <BudgetItem
                color={color}
                onClick={() => {
                  if (`${month}_${item[0]}` !== params?.id)
                    navigate(`${month}_${item[0]}`, {
                      replace: params?.id !== undefined,
                    });
                }}
                key={item[0]}
                item={item}
                conversion={conversion}
                currency={currency}
                spend={spend}
              />
            );
          })}
        </div>
      </div>
      <Outlet />
      {isOpen && <CreateBudget setIsOpen={setIsOpen} isEdit={isEdit} />}
    </div>
  );
}

export default React.memo(Budgets);
