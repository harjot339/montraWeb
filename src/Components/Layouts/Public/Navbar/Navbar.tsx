/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { COLORS } from '../../../../Shared/commonStyles';
import { db } from '../../../../Utils/firebaseConfig';
import { ROUTES } from '../../../../Shared/Constants';
import { currencies, STRINGS } from '../../../../Shared/Strings';
import { RootState } from '../../../../Store';
import { encrypt } from '../../../../Utils/encryption';
import { setSidebar } from '../../../../Store/Loader';
import useAppTheme from '../../../../Hooks/themeHook';
import Sun from '../../../../assets/svgs/sun.svg';
import Moon from '../../../../assets/svgs/moon.svg';
import Device from '../../../../assets/svgs/device.svg';
import DeviceWhite from '../../../../assets/svgs/device-white.svg';
import Transaction from '../../../../assets/svgs/transaction.svg';
import Pie from '../../../../assets/svgs/pie-chart.svg';
import Dashboard from '../../../../assets/svgs/dashboard.svg';
import Report from '../../../../assets/svgs/report.svg';
import Logout from '../../../../assets/svgs/logout.svg';
import LogoutModal from '../../../LogoutModal/LogoutModal';

export function SidebarLayout({
  children,
}: Readonly<{ children: React.JSX.Element }>) {
  const isOpen = useSelector((state: RootState) => state.loader.sidebar);
  const dispatch = useDispatch();
  const location = useLocation();
  const currency = useSelector(
    (state: RootState) => state.common.user?.currency
  );
  const [modal, setModal] = useState<boolean>(false);
  const theme = useSelector((state: RootState) => state.common.user?.theme);
  const uid = useSelector((state: RootState) => state.common.user?.uid);
  const navigate = useNavigate();
  const [appTheme, COLOR] = useAppTheme();

  return (
    <>
      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-48 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div
          className={clsx(
            'h-full px-3 py-4 overflow-y-auto',
            appTheme === 'dark' ? 'bg-black' : 'bg-white'
          )}
        >
          <ul className="space-y-2 font-medium flex flex-col justify-between h-full">
            <div>
              {[
                {
                  name: 'Dashboard',
                  route: ROUTES.HOMEPAGE,
                  check: location.pathname === '/',
                  icon: Dashboard,
                },
                {
                  name: 'Transactions',
                  route: ROUTES.Transactions,
                  check: location.pathname.startsWith('/transactions'),
                  icon: Transaction,
                },
                {
                  name: 'Budgets',
                  route: ROUTES.Budgets,
                  check: location.pathname.startsWith('/budgets'),
                  icon: Pie,
                },
                {
                  name: 'Report',
                  route: ROUTES.Report,
                  check: location.pathname.startsWith('/report'),
                  icon: Report,
                },
              ].map(({ name, route, check, icon }) => (
                <li key={name}>
                  <button
                    type="button"
                    onClick={() => {
                      navigate(route);
                      dispatch(setSidebar(false));
                      document
                        .getElementById('default-sidebar')!
                        .classList.toggle('-translate-x-full');
                    }}
                    className={clsx(
                      'flex items-center p-2 w-full text-gray-900 rounded-lg hover:bg-gray-100 group my-2 outline-none',
                      appTheme === 'dark' && 'text-white hover:bg-gray-700'
                    )}
                    style={{
                      backgroundColor: check ? COLORS.VIOLET[20] : undefined,
                      color: check ? COLORS.VIOLET[100] : undefined,
                    }}
                  >
                    <img src={icon} alt="" width="25px" />
                    <span className="ms-3">{name}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setModal(true);
                  }}
                  className={clsx(
                    'flex items-center p-2 w-full text-gray-900 rounded-lg hover:bg-red-100 group',
                    appTheme === 'dark' && 'text-white hover:bg-red-400'
                  )}
                >
                  <img src={Logout} alt="" width="20px" />
                  <span className="ms-4 whitespace-nowrap">
                    {STRINGS.Logout}
                  </span>
                </button>
              </li>
            </div>
            <div>
              <li className="flex gap-2 border justify-center w-fit px-3 py-2 rounded-xl mb-3">
                {theme === 'light' && <img src={Sun} alt="" width="25px" />}
                {theme === 'dark' && <img src={Moon} alt="" width="25px" />}
                {theme === 'device' && appTheme === 'light' && (
                  <img src={Device} alt="" width="25px" />
                )}
                {theme === 'device' && appTheme === 'dark' && (
                  <img src={DeviceWhite} alt="" width="25px" />
                )}
                <select
                  className={clsx(
                    'bg-transparent outline-none',
                    appTheme === 'dark' && 'text-white'
                  )}
                  onChange={async (e) => {
                    await updateDoc(doc(db, 'users', uid!), {
                      theme: encrypt(e.target.value, uid!),
                    });
                  }}
                  value={theme!}
                >
                  {['light', 'dark', 'device'].map((item) => (
                    <option key={item} value={item}>
                      {item[0].toUpperCase() + item.slice(1)}
                    </option>
                  ))}
                </select>
              </li>
              <li className="flex gap-2 border justify-center w-fit px-3 py-3 rounded-xl mb-5">
                <select
                  className={clsx(
                    'bg-transparent outline-none',
                    appTheme === 'dark' && 'text-white'
                  )}
                  value={currency ?? 'USD'}
                  onChange={async (e) => {
                    await updateDoc(doc(db, 'users', uid!), {
                      currency: encrypt(e.target.value, uid!),
                    });
                  }}
                >
                  {Object.values(currencies).map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.symbol} {item.code}
                    </option>
                  ))}
                </select>
              </li>
            </div>
          </ul>
        </div>
      </aside>
      <div
        style={{
          position: 'absolute',
          zIndex: isOpen ? 1 : -1,
          width: '100vw',
          height: 'fit-content',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
        onClick={() => {
          dispatch(setSidebar(false));
          document
            .getElementById('default-sidebar')!
            .classList.toggle('-translate-x-full');
        }}
      />
      <LogoutModal modal={modal} setModal={setModal} />
      <div
        style={{
          width: '100vw',
          height: '100%',
          minHeight: '100vh',
          backgroundColor: COLOR.PRIMARY.LIGHT,
        }}
      >
        {children}
      </div>
    </>
  );
}

export default React.memo(SidebarLayout);
