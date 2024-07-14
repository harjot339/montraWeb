import React, { useState } from 'react';
import { Timestamp, updateDoc, doc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { STRINGS, monthData } from '../../../Shared/Strings';
import { encrypt } from '../../../Utils/encryption';
import { db } from '../../../Utils/firebaseConfig';
import { RootState } from '../../../Store';
import NotificationIcon from '../../../assets/svgs/notifiaction.svg';

function Header({
  month,
  setMonth,
}: {
  month: number;
  setMonth: React.Dispatch<React.SetStateAction<number>>;
}) {
  const notifications = useSelector(
    (state: RootState) => state.common.user?.notification
  );
  const uid = useSelector((state: RootState) => state.common.user?.uid);
  const [menu, setMenu] = useState<boolean>(false);

  return (
    <div className="flex justify-between align-middle mb-4">
      <p className="text-3xl sm:text-4xl font-bold">{STRINGS.Dashboard}</p>
      <div className="flex self-center gap-x-5">
        {menu && (
          <div className="bg-white rounded-xl shadow absolute top-14 right-7 pt-5 pb-3">
            {Object.values(notifications!).length === 0 ? (
              <p className="px-5 pb-1 text-gray-600">
                {STRINGS.NoNotification}
              </p>
            ) : (
              <>
                {Object.values(notifications!).map((item, i, arr) => (
                  <div key={item.id}>
                    <div className="flex justify-between items-center px-6 gap-x-5">
                      <div>
                        <p className="text-xl font-semibold">
                          {item.type === 'budget-percent'
                            ? `Exceeded ${item.percentage}% of ${
                                item.category[0].toUpperCase() +
                                item.category.slice(1)
                              } budget`
                            : `${
                                item.category[0].toUpperCase() +
                                item.category.slice(1)
                              } Budget Limit Exceeded`}
                        </p>
                        <p className="text-gray-600">
                          {item.type === 'budget-percent'
                            ? `You've exceeded ${item.percentage}% of your ${
                                item.category[0].toUpperCase() +
                                item.category.slice(1)
                              } budget. Take action to stay on track.`
                            : `Your ${item.category[0].toUpperCase()}${item.category.slice(
                                1
                              )} ${STRINGS.BudgetExceed}`}
                        </p>
                      </div>
                      <div>
                        <p>
                          {Timestamp.fromMillis(item.time.seconds * 1000)
                            .toDate()
                            .getHours()}
                          .
                          {Timestamp.fromMillis(item.time.seconds * 1000)
                            .toDate()
                            .getMinutes() < 10
                            ? `0${Timestamp.fromMillis(item.time.seconds * 1000)
                                .toDate()
                                .getMinutes()}`
                            : Timestamp.fromMillis(item.time.seconds * 1000)
                                .toDate()
                                .getMinutes()}
                        </p>
                      </div>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="w-full bg-gray-200 my-3 h-px" />
                    )}
                  </div>
                ))}
                <div className="flex mt-4 px-6 justify-end">
                  <button
                    type="button"
                    className="outline-none self-end bg-transparent text-lg font-bold hover:bg-slate-100 px-2"
                    onClick={async () => {
                      try {
                        setMenu(false);
                        await updateDoc(doc(db, 'users', uid!), {
                          notification: {},
                        });
                      } catch (e) {
                        toast.error(e as string);
                      }
                    }}
                  >
                    {STRINGS.ClearAll}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        <select
          className="bg-transparent rounded-lg border h-10"
          value={monthData[month].value}
          onChange={(e) => {
            setMonth(Number(e.target.value) - 1);
          }}
        >
          {monthData.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="bg-transparent outline-none"
          onClick={async () => {
            setMenu((x) => !x);
            if (
              !menu &&
              Object.values(notifications!).filter((item) => !item.read)
                .length > 0
            ) {
              const readNotifications = Object.values(notifications!).reduce(
                (
                  acc: {
                    [key: string]: {
                      category: string;
                      type: string;
                      id: string;
                      time: Timestamp;
                      read: boolean;
                    };
                  },
                  val
                ) => {
                  acc[val.id] = {
                    ...val,
                    category: encrypt(val.category, uid!),
                    type: encrypt(val.type, uid!),
                    read: true,
                  };
                  return acc;
                },
                {}
              );
              await updateDoc(doc(db, 'users', uid!), {
                notification: readNotifications,
              });
            }
          }}
        >
          {Object.values(notifications ?? {}).filter((item) => !item.read)
            .length > 0 && (
            <p className="bg-white text-sm font-bold h-5 text-violet-500 absolute rounded-full flex justify-center items-center w-5 top-8 right-5">
              {
                Object.values(notifications ?? {}).filter((item) => !item.read)
                  .length
              }
            </p>
          )}
          <img src={NotificationIcon} alt="" width="25px" />
        </button>
      </div>
    </div>
  );
}

export default React.memo(Header);
