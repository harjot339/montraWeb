import React, { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { TransactionType } from '../../Defs/transaction';
import { RootState } from '../../Store';
import TransactionListItem from '../../Components/TransactionListItem';

function TransactionScreen() {
  const [offset] = useState<number>(0);
  const limit = 100;
  const filters = useSelector((state: RootState) => state.transactions.filters);
  const transaction = useSelector(
    (state: RootState) => state.transactions.transactions
  );
  // state
  const [month] = useState<number>(new Date().getMonth());
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
      return x.slice().reverse();
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
  return (
    <div className="sm:ml-48 pt-4 px-4">
      {applyFilters(offset).map((data) => (
        <>
          <p className="text-4xl font-semibold my-3">
            {data.title[0].toUpperCase() + data.title.slice(1)}
          </p>
          <ul className="flex flex-wrap gap-x-3 border" key={data.title}>
            {data.data.map((item) => (
              <TransactionListItem item={item} key={item.id} width="half" />
            ))}
          </ul>
        </>
      ))}
    </div>
  );
}

export default React.memo(TransactionScreen);
