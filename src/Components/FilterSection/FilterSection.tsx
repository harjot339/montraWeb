import React, {
  useState,
  useRef,
  useCallback,
  SetStateAction,
  useEffect,
} from 'react';
// Third Party Libraries
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import Multiselect from 'multiselect-react-dropdown';
// Custom Components
import CustomButton from '../CustomButton';
import { COLORS } from '../../Shared/commonStyles';
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
  const multiRef1 = useRef<Multiselect>(null);
  const multiRef2 = useRef<Multiselect>(null);
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
    await multiRef1.current?.resetSelectedValues();
    await multiRef2.current?.resetSelectedValues();
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
        <Multiselect
          ref={multiRef1}
          selectedValues={incomeCategory.map((item) => {
            return { cat: item, key: item[0].toUpperCase() + item.slice(1) };
          })}
          placeholder="Income Categories"
          displayValue="key"
          style={{
            searchBox: {
              borderRadius: '8px',
            },
            option: {
              backgroundColor: theme === 'dark' ? 'black' : 'white',
              color: theme === 'dark' ? 'white' : 'black',
            },
          }}
          onKeyPressFn={() => {}}
          onRemove={(_, item) => {
            setIncomeCategory((cat) => {
              return cat.filter(
                (i) => i.toLowerCase() !== item.key.toLowerCase()
              );
            });
          }}
          onSearch={() => {}}
          onSelect={(_, item) => {
            setIncomeCategory((cat) => {
              return [...cat, item.key.toLowerCase()];
            });
          }}
          options={incomeCategories?.slice(1).map((item) => {
            return { cat: item, key: item[0].toUpperCase() + item.slice(1) };
          })}
        />
        <p
          className={clsx(
            'text-xl font-semibold my-3',
            theme === 'dark' && 'text-white'
          )}
        >
          {STRINGS.Expense}
        </p>
        <Multiselect
          ref={multiRef2}
          selectedValues={expenseCategory.map((item) => {
            return { cat: item, key: item[0].toUpperCase() + item.slice(1) };
          })}
          placeholder="Expense Categories"
          displayValue="key"
          style={{
            searchBox: {
              borderRadius: '8px',
            },
            option: {
              backgroundColor: theme === 'dark' ? 'black' : 'white',
              color: theme === 'dark' ? 'white' : 'black',
            },
          }}
          onKeyPressFn={() => {}}
          onRemove={(_, item) => {
            setExpenseCategory((cat) => {
              return cat.filter(
                (i) => i.toLowerCase() !== item.key.toLowerCase()
              );
            });
          }}
          onSearch={() => {}}
          onSelect={(_, item) => {
            setExpenseCategory((cat) => {
              return [...cat, item.key.toLowerCase()];
            });
          }}
          options={expenseCategories?.slice(1).map((item) => {
            return { cat: item, key: item[0].toUpperCase() + item.slice(1) };
          })}
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
