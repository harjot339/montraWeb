import React, { useRef, useState } from 'react';
import { Timestamp, updateDoc, doc } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { STRINGS, monthData } from '../../../Shared/Strings';
import { encrypt } from '../../../Utils/encryption';
import { db } from '../../../Utils/firebaseConfig';
import { RootState } from '../../../Store';
import NotificationIcon from '../../../assets/svgs/notifiaction.svg';
import SidebarButton from '../../../Components/SidebarButton';
import useAppTheme from '../../../Hooks/themeHook';
import CustomDropdown from '../../../Components/CustomDropdown';
import useOutsideAlerter from '../../../Hooks/outsideClick';
import { formatAMPM } from '../../../Utils/commonFuncs';
import NotifcationDeleteModal from '../../../Components/NotifcationDeleteModal/NotifcationDeleteModal';

function Header({
  month,
  setMonth,
}: Readonly<{
  month: number;
  setMonth: React.Dispatch<React.SetStateAction<number>>;
}>) {
  const notifications = useSelector(
    (state: RootState) => state.common.user?.notification
  );
  const uid = useSelector((state: RootState) => state.common.user?.uid);
  const [menu, setMenu] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [theme] = useAppTheme();
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideAlerter(wrapperRef, () => {
    if (menu) {
      setMenu(false);
    }
  });
  return (
    <div className="flex gap-x-3 sm:justify-between align-middle mb-4 items-center flex-wrap gap-y-3">
      <SidebarButton />
      <NotifcationDeleteModal
        modal={modal}
        setModal={setModal}
        setMenu={setMenu}
        uid={uid}
      />
      <p
        className={clsx(
          'text-3xl sm:text-4xl font-bold',
          theme === 'dark' && 'text-white'
        )}
      >
        {STRINGS.Dashboard}
      </p>
      <div
        className="flex justify-between w-full sm:w-fit gap-x-5"
        ref={wrapperRef}
      >
        {menu && (
          <div
            className={clsx(
              'rounded-xl shadow absolute top-24 right-9 sm:top-14 sm:right-7 pt-5 pb-3 z-10',
              theme === 'dark' ? 'bg-black shadow-gray-50' : 'bg-white'
            )}
          >
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
                        <p
                          className={clsx(
                            'text-md sm:text-xl font-semibold',
                            theme === 'dark' && 'text-white'
                          )}
                        >
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
                        <p className="text-sm sm:text-lg text-gray-600">
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
                        <p className={clsx(theme === 'dark' && 'text-white')}>
                          {formatAMPM(
                            Timestamp.fromMillis(
                              item.time.seconds * 1000
                            ).toDate()
                          )}
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
                    className={clsx(
                      'outline-none self-end bg-transparent text-lg font-bold hover:bg-slate-100 px-2 rounded-xl',
                      theme === 'dark' && 'text-white hover:bg-gray-800'
                    )}
                    onClick={() => {
                      setModal(true);
                    }}
                  >
                    {STRINGS.ClearAll}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
        <CustomDropdown
          data={monthData.slice(0, new Date().getMonth() + 1)}
          onChange={(e) => {
            setMonth(Number(e!.value) - 1);
          }}
          placeholder={STRINGS.Month}
          value={monthData[month]}
        />
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
            <p
              className={clsx(
                'text-sm font-bold h-5 text-violet-500 absolute rounded-full flex justify-center items-center w-5 -translate-x-2 translate-y-3 ',
                theme === 'dark' ? 'bg-black' : 'bg-white'
              )}
            >
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
