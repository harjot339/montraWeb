import React, { useState } from 'react';
// Third Party Libraries
import { Timestamp } from 'firebase/firestore';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import ReactModal from 'react-modal';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
// Custom Components
import { RemoveScroll } from 'react-remove-scroll';
import { TransactionType } from '../../Defs/transaction';
import { RootState } from '../../Store';
import TransactionListItem from '../../Components/TransactionListItem';
import { monthData, STRINGS } from '../../Shared/Strings';
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown';
import SidebarButton from '../../Components/SidebarButton';
import useAppTheme from '../../Hooks/themeHook';
import {
  useIsDesktop,
  useIsMobile,
  useIsTablet,
} from '../../Hooks/mobileCheckHook';
import FilterSection from '../../Components/FilterSection';
import { COLORS } from '../../Shared/commonStyles';

function TransactionScreen() {
  // redux
  const filters = useSelector((state: RootState) => state.transactions.filters);
  const transaction = useSelector(
    (state: RootState) => state.transactions.transactions
  );
  const currency = useSelector(
    (state: RootState) => state.common.user?.currency
  );
  const navigate = useNavigate();
  const params = useParams();
  // state
  const [offset] = useState<number>(0);
  const limit = 100;
  const [month, setMonth] = useState<number>(new Date().getMonth());
  const [filter, setFilter] = useState<boolean>(false);
  // functions
  function filterDataByDate(data: TransactionType[], ofset: number) {
    const startOfToday = new Date().setHours(0, 0, 0, 0) / 1000;
    const startOfYesterday = startOfToday - 24 * 60 * 60;
    const res = data
      .slice()
      .sort((a, b) => b.timeStamp.seconds - a.timeStamp.seconds)
      .slice(0, ofset + limit)
      .filter(
        (item) =>
          Timestamp.fromMillis(item.timeStamp.seconds * 1000)
            .toDate()
            .getMonth() === month
      )
      .reduce(
        (
          acc: {
            [key: string]: Array<TransactionType>;
          },
          item
        ) => {
          const itemTime = item.timeStamp.seconds;
          if (itemTime >= startOfToday) {
            if (acc.today) {
              acc.today.push(item);
            } else {
              acc.today = [item];
            }
          } else if (itemTime >= startOfYesterday) {
            if (acc.yesterday) {
              acc.yesterday.push(item);
            } else {
              acc.yesterday = [item];
            }
          } else if (
            acc[
              Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                .toDate()
                .toLocaleDateString()
            ]
          ) {
            acc[
              Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                .toDate()
                .toLocaleDateString()
            ].push(item);
          } else {
            acc[
              Timestamp.fromMillis(item.timeStamp.seconds * 1000)
                .toDate()
                .toLocaleDateString()
            ] = [item];
          }
          return acc;
        },
        {}
      );

    const result = [
      {
        title: 'today',
        data:
          res.today === undefined
            ? []
            : [...res.today].sort(
                (a, b) => b.timeStamp.seconds - a.timeStamp.seconds
              ) ?? [],
      },
      {
        title: 'yesterday',
        data:
          res.yesterday === undefined
            ? []
            : [...res.yesterday].sort(
                (a, b) => b.timeStamp.seconds - a.timeStamp.seconds
              ) ?? [],
      },
    ];
    delete res.today;
    delete res.yesterday;
    const x = Object.entries(res).reduce(
      (
        acc: Array<{
          title: string;
          data: Array<TransactionType>;
        }>,
        curr
      ) => {
        acc.push({
          title: curr[0],
          data: [...curr[1]].sort(
            (a, b) => b.timeStamp.seconds - a.timeStamp.seconds
          ),
        });
        return acc;
      },
      []
    );
    return [...result, ...x];
  }
  function applyFilters(ofset: number) {
    const data = filterDataByDate(transaction, ofset);
    const catFiltered =
      filters.cat.length === 0
        ? data
        : data.map((d) => {
            return {
              title: d.title,
              data: d.data.filter((item) =>
                filters.cat.length === 0
                  ? true
                  : filters.cat.includes(item.category)
              ),
            };
          });
    const x =
      filters.filter === 'none'
        ? catFiltered
        : catFiltered.map((d) => {
            return {
              title: d.title,
              data: d.data.filter((item) => item.type === filters.filter),
            };
          });
    if (filters.sort === 'oldest') {
      return x
        .slice()
        .map((item) => ({
          title: item.title,
          data: item.data.slice().reverse(),
        }))
        .reverse();
    }
    if (filters.sort === 'lowest') {
      return [
        {
          title: '',
          data: Object.values(transaction)
            .slice()
            .filter(
              (item) =>
                (filters.cat.length === 0
                  ? true
                  : filters.cat.includes(item.category)) &&
                (filters.filter === 'none'
                  ? true
                  : item.type === filters.filter)
            )
            .sort((a, b) => a.amount - b.amount),
        },
      ];
    }
    if (filters.sort === 'highest') {
      return [
        {
          title: '',
          data: Object.values(transaction)
            .slice()
            .filter(
              (item) =>
                (filters.cat.length === 0
                  ? true
                  : filters.cat.includes(item.category)) &&
                (filters.filter === 'none'
                  ? true
                  : item.type === filters.filter)
            )
            .sort((a, b) => b.amount - a.amount),
        },
      ];
    }
    return x;
  }
  // constants
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const isDesktop = useIsDesktop();
  const [theme] = useAppTheme();
  return (isTablet || isMobile) && params?.id !== undefined ? (
    <div className={clsx(isTablet && 'ml-52')}>
      <Outlet />
    </div>
  ) : (
    <div className="sm:ml-48 pt-4 px-2 sm:px-4 flex gap-3 justify-between">
      <div className="w-full">
        <div className="flex w-full flex-1 gap-3 sm:justify-between items-center flex-wrap my-3">
          <SidebarButton />
          <p
            className={clsx(
              'text-3xl sm:text-4xl font-bold',
              theme === 'dark' && 'text-white'
            )}
          >
            {STRINGS.Transaction}
          </p>
          <div className="flex justify-between w-full sm:w-fit items-center gap-x-3">
            <CustomDropdown
              data={monthData.slice(0, new Date().getMonth() + 1)}
              value={monthData[month]}
              placeholder={STRINGS.Month}
              onChange={(e) => {
                setMonth(Number(e!.value) - 1);
              }}
            />
            {(isTablet || isMobile) && (
              <button
                className={clsx(
                  'h-11 w-11 flex items-center justify-center rounded-lg',
                  theme === 'dark' ? 'bg-black' : 'bg-white '
                )}
                type="button"
                onClick={() => {
                  setFilter((x) => !x);
                }}
              >
                <svg
                  fill={theme === 'dark' ? 'white' : 'black'}
                  height="25px"
                  width="25px"
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 300.906 300.906"
                >
                  <g>
                    <g>
                      <path
                        d="M288.953,0h-277c-5.522,0-10,4.478-10,10v49.531c0,5.522,4.478,10,10,10h12.372l91.378,107.397v113.978
			c0,3.688,2.03,7.076,5.281,8.816c1.479,0.792,3.101,1.184,4.718,1.184c1.94,0,3.875-0.564,5.548-1.68l49.5-33
			c2.782-1.854,4.453-4.977,4.453-8.32v-80.978l91.378-107.397h12.372c5.522,0,10-4.478,10-10V10C298.953,4.478,294.476,0,288.953,0
			z M167.587,166.77c-1.539,1.809-2.384,4.105-2.384,6.48v79.305l-29.5,19.666V173.25c0-2.375-0.845-4.672-2.384-6.48L50.585,69.531
			h199.736L167.587,166.77z M278.953,49.531h-257V20h257V49.531z"
                      />
                    </g>
                  </g>
                </svg>
              </button>
            )}
          </div>
        </div>
        <ReactModal
          isOpen={filter}
          onRequestClose={() => {
            setFilter(false);
          }}
          style={{
            content: {
              width: 'min-content',
              height: 'min-content',
              margin: 'auto',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              border: 0,
              backgroundColor:
                theme === 'dark' ? COLORS.DARK[100] : COLORS.LIGHT[100],
              inset: 0,
            },
            overlay: {
              padding: 0,
              backgroundColor: theme === 'dark' ? '#ffffff30' : '#00000050',
            },
          }}
        >
          <RemoveScroll>
            <FilterSection setMenu={setFilter} />
          </RemoveScroll>
        </ReactModal>
        {applyFilters(offset).length === 2 &&
        applyFilters(offset)[0].data.length === 0 &&
        applyFilters(offset)[1].data.length === 0 ? (
          <div className="flex w-full h-full justify-center items-center">
            <p className="text-gray-400 text-xl">
              {STRINGS.NoTransactionsMonth}
            </p>
          </div>
        ) : (
          <div className="w-full">
            {applyFilters(offset).map((data) => (
              <>
                {data.data.length !== 0 && data.title !== '' && (
                  <p
                    className={clsx(
                      'text-2xl sm:text-3xl font-semibold my-3',
                      theme === 'dark' && 'text-white'
                    )}
                  >
                    {data.title[0].toUpperCase() + data.title.slice(1)}
                  </p>
                )}
                <ul
                  className="flex flex-wrap gap-1 sm:gap-4 px-3"
                  key={data.title}
                >
                  {data.data.map((item) => (
                    <TransactionListItem
                      selected={params.id === item.id}
                      item={item}
                      key={item.id}
                      width="half"
                      currency={currency}
                      onClick={() => {
                        navigate(item.id, {
                          replace: params?.id !== undefined,
                        });
                      }}
                    />
                  ))}
                </ul>
              </>
            ))}
          </div>
        )}
      </div>
      {isDesktop && <Outlet />}
    </div>
  );
}

export default React.memo(TransactionScreen);
