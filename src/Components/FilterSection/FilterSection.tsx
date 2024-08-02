import React, { useState, useCallback, SetStateAction, useEffect } from 'react';
// Third Party Libraries
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import Select from 'react-select';
// Custom Components
import CustomButton from '../CustomButton';
import { COLORS, PlaceholderTextColor } from '../../Shared/commonStyles';
import { STRINGS } from '../../Shared/Strings';
import {
  setFilters,
  setSortFilter,
  clearCatFilter,
  setCatFilter,
} from '../../Store/Transactions';
import { RootState } from '../../Store';
import useAppTheme from '../../Hooks/themeHook';

function FilterSection({
  setMenu,
}: Readonly<{
  setMenu: React.Dispatch<SetStateAction<boolean>> | undefined;
}>) {
  // state
  const [filter, setFilter] = useState<number>(-1);
  const [sort, setSort] = useState<number>(-1);
  const [incomeCategory, setIncomeCategory] = useState<string[]>([]);
  const [expenseCategory, setExpenseCategory] = useState<string[]>([]);
  // ref
  // redux
  const incomeCategories = useSelector(
    (state: RootState) => state.common.user?.incomeCategory
  );
  const expenseCategories = useSelector(
    (state: RootState) => state.common.user?.expenseCategory
  );
  const filters = useSelector((state: RootState) => state.transactions.filters);
  // constants
  const dispatch = useDispatch();
  const [theme, COLOR] = useAppTheme();
  // functions
  const handleReset = useCallback(async () => {
    setFilter(-1);
    setSort(-1);
    dispatch(setFilters(-1));
    dispatch(setSortFilter(-1));
    dispatch(clearCatFilter());
  }, [dispatch]);
  const handleSubmit = useCallback(() => {
    dispatch(setFilters(filter));
    dispatch(setSortFilter(sort));
    dispatch(setCatFilter([...incomeCategory, ...expenseCategory]));
    if (setMenu) {
      setMenu(false);
    }
  }, [dispatch, expenseCategory, filter, incomeCategory, setMenu, sort]);
  useEffect(() => {
    if (filters.filter === 'income') {
      setFilter(0);
    } else if (filters.filter === 'expense') {
      setFilter(1);
    } else if (filters.filter === 'transfer') {
      setFilter(2);
    }
    if (filters.sort === 'highest') {
      setSort(0);
    } else if (filters.sort === 'lowest') {
      setSort(1);
    } else if (filters.sort === 'newest') {
      setSort(2);
    } else if (filters.sort === 'oldest') {
      setSort(3);
    }
    setIncomeCategory(
      filters.cat.filter((item) => incomeCategories?.includes(item))
    );
    setExpenseCategory(
      filters.cat.filter((item) => expenseCategories?.includes(item))
    );
  }, [expenseCategories, filters, incomeCategories]);

  return (
    <div
      className={clsx(
        'rounded-lg px-2 sm:px-4 py-4 sticky top-2 right-0 min-w-[345px] h-fit max-w-[450px]',
        theme === 'dark' ? 'bg-black' : 'bg-white'
      )}
    >
      <div className="flex items-center justify-between">
        <p
          className={clsx(
            'text-3xl font-semibold ',
            theme === 'dark' && 'text-white'
          )}
        >
          {STRINGS.Filters}
        </p>
        <button
          type="button"
          className="rounded-2xl px-4 h-8 text-sm sm:text-base font-semibold"
          style={{
            backgroundColor: COLORS.VIOLET[20],
            color: COLORS.VIOLET[100],
          }}
          onClick={handleReset}
        >
          {STRINGS.Reset}
        </button>
      </div>
      <p
        className={clsx(
          'text-xl font-semibold my-3',
          theme === 'dark' && 'text-white'
        )}
      >
        {STRINGS.FilterBy}
      </p>
      <div className="flex flex-wrap gap-3">
        {['Income', 'Expense', 'Transfer'].map((item, i) => (
          <button
            key={item}
            type="button"
            className="py-2 px-4 sm:py-3 sm:px-6 rounded-3xl"
            style={{
              border: `1px solid ${COLORS.LIGHT[20]}`,
              backgroundColor:
                filter === i ? COLORS.VIOLET[20] : COLOR.LIGHT[100],
              color: filter === i ? COLORS.VIOLET[100] : COLOR.DARK[100],
            }}
            onClick={() => {
              if (filter === i) {
                setFilter(-1);
              } else {
                setFilter(i);
              }
            }}
          >
            {item}
          </button>
        ))}
      </div>
      <p
        className={clsx(
          'text-xl font-semibold my-3',
          theme === 'dark' && 'text-white'
        )}
      >
        {STRINGS.SortBy}
      </p>
      <div className="flex flex-wrap gap-3">
        {['Highest', 'Lowest', 'Newest', 'Oldest'].map((item, i) => (
          <button
            key={item}
            type="button"
            className="py-2 px-4 sm:py-3 sm:px-6 rounded-3xl"
            style={{
              border: `1px solid ${COLORS.LIGHT[20]}`,
              backgroundColor:
                sort === i ? COLORS.VIOLET[20] : COLOR.LIGHT[100],
              color: sort === i ? COLORS.VIOLET[100] : COLOR.DARK[100],
            }}
            onClick={() => {
              if (sort === i) {
                setSort(-1);
              } else {
                setSort(i);
              }
            }}
          >
            {item}
          </button>
        ))}
      </div>
      <p
        className={clsx(
          'text-xl font-semibold my-3',
          theme === 'dark' && 'text-white'
        )}
      >
        {STRINGS.Category}
      </p>
      <div>
        <p
          className={clsx(
            'text-xl font-semibold my-3',
            theme === 'dark' && 'text-white'
          )}
        >
          {STRINGS.Income}
        </p>
        <Select
          menuPlacement="top"
          isMulti
          options={incomeCategories?.slice(1).map((item) => {
            return {
              value: item,
              label: item[0].toUpperCase() + item.slice(1),
            };
          })}
          onChange={(data) => {
            setIncomeCategory(data.map((item) => item.value));
          }}
          placeholder="Income Categories"
          value={incomeCategory.map((item) => {
            return {
              value: item,
              label: item[0].toUpperCase() + item.slice(1),
            };
          })}
          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              outline: 'none',
              borderColor: theme === 'dark' ? '#7A7E80' : '#bbbbbb',
              minHeight: '56px',
              borderRadius: '8px',
              padding: '0px 10px',
              backgroundColor: 'transparent',
            }),
            option: (base) => ({
              ...base,
              backgroundColor: COLOR.LIGHT[100],
              color: COLOR.DARK[100],
            }),
            placeholder: (base) => ({
              ...base,
              color: PlaceholderTextColor,
            }),
            container: (base) => ({
              ...base,
              width: '100%',
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: COLOR.LIGHT[100],
              boxShadow:
                theme === 'dark' ? '1px 1px 5px white' : '1px 1px 5px gray',
              scrollbarColor:
                theme === 'dark'
                  ? `${COLORS.DARK[50]} ${COLORS.DARK[75]}`
                  : `${COLORS.LIGHT[20]} ${COLORS.LIGHT[80]}`,
            }),
            dropdownIndicator: (base) => ({
              ...base,
              color: theme === 'dark' ? COLORS.LIGHT[20] : COLORS.DARK[50],
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: COLOR.LIGHT[40],
              color: COLOR.DARK[100],
            }),
            multiValueLabel: (base) => ({
              ...base,
              backgroundColor: COLOR.LIGHT[40],
              color: COLOR.DARK[100],
            }),
          }}
        />
        <p
          className={clsx(
            'text-xl font-semibold my-3',
            theme === 'dark' && 'text-white'
          )}
        >
          {STRINGS.Expense}
        </p>
        <Select
          menuPlacement="top"
          isMulti
          options={expenseCategories?.slice(1).map((item) => {
            return {
              value: item,
              label: item[0].toUpperCase() + item.slice(1),
            };
          })}
          onChange={(data) => {
            setExpenseCategory(data.map((item) => item.value));
          }}
          placeholder="Expense Categories"
          value={expenseCategory.map((item) => {
            return {
              value: item,
              label: item[0].toUpperCase() + item.slice(1),
            };
          })}
          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              outline: 'none',
              borderColor: theme === 'dark' ? '#7A7E80' : '#bbbbbb',
              minHeight: '56px',
              borderRadius: '8px',
              padding: '0px 10px',
              backgroundColor: 'transparent',
            }),
            option: (base) => ({
              ...base,
              backgroundColor: COLOR.LIGHT[100],
              color: COLOR.DARK[100],
            }),
            placeholder: (base) => ({
              ...base,
              color: PlaceholderTextColor,
            }),
            container: (base) => ({
              ...base,
              width: '100%',
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: COLOR.LIGHT[100],
              boxShadow:
                theme === 'dark' ? '1px 1px 5px white' : '1px 1px 5px gray',
              scrollbarColor:
                theme === 'dark'
                  ? `${COLORS.DARK[50]} ${COLORS.DARK[75]}`
                  : `${COLORS.LIGHT[20]} ${COLORS.LIGHT[80]}`,
            }),
            dropdownIndicator: (base) => ({
              ...base,
              color: theme === 'dark' ? COLORS.LIGHT[20] : COLORS.DARK[50],
            }),
            multiValue: (base) => ({
              ...base,
              backgroundColor: COLOR.LIGHT[40],
              color: COLOR.DARK[100],
            }),
            multiValueLabel: (base) => ({
              ...base,
              backgroundColor: COLOR.LIGHT[40],
              color: COLOR.DARK[100],
            }),
          }}
        />
      </div>
      <div className="flex mt-7">
        <CustomButton
          disabled={
            filter === -1 &&
            sort === -1 &&
            incomeCategory.length === 0 &&
            expenseCategory.length === 0
          }
          flex={1}
          title={STRINGS.Apply}
          onPress={handleSubmit}
        />
      </div>
    </div>
  );
}

export default React.memo(FilterSection);
