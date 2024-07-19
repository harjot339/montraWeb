import React, { useState } from 'react';
// Third Party Libraries
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
// Custom Components
import CustomDropdown from '../../../CustomDropdown';
import LogoutModal from '../../../LogoutModal';
import { COLORS } from '../../../../Shared/commonStyles';
import { db } from '../../../../Utils/firebaseConfig';
import { ROUTES } from '../../../../Shared/Constants';
import { currencies, STRINGS } from '../../../../Shared/Strings';
import { RootState } from '../../../../Store';
import { encrypt } from '../../../../Utils/encryption';
import { setSidebar } from '../../../../Store/Loader';
import useAppTheme from '../../../../Hooks/themeHook';
import Transaction from '../../../../assets/svgs/transaction.svg';
import Pie from '../../../../assets/svgs/pie-chart.svg';
import Dashboard from '../../../../assets/svgs/dashboard.svg';
import Report from '../../../../assets/svgs/report.svg';
import Logout from '../../../../assets/svgs/logout.svg';

export function SidebarLayout({
  children,
}: Readonly<{ children: React.JSX.Element }>) {
  // constants
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [appTheme, COLOR] = useAppTheme();
  // redux
  const isOpen = useSelector((state: RootState) => state.loader.sidebar);
  const currency = useSelector(
    (state: RootState) => state.common.user?.currency
  );
  const theme = useSelector((state: RootState) => state.common.user?.theme);
  const uid = useSelector((state: RootState) => state.common.user?.uid);
  // state
  const [modal, setModal] = useState<boolean>(false);
  return (
    <div
      style={{
        width: '100vw',
        height: '100%',
        position: 'relative',
      }}
    >
      <aside
        id="default-sidebar"
        className="fixed top-0 z-40 sm:z-0 left-0 w-48 h-screen transition-transform -translate-x-full sm:translate-x-0"
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
              <CustomDropdown
                menuPlacement="top"
                data={['light', 'dark', 'device'].map((item) => ({
                  label: item[0].toUpperCase() + item.slice(1),
                  value: item,
                }))}
                placeholder="Theme"
                value={{
                  label: theme![0].toUpperCase() + theme!.slice(1),
                  value: theme!,
                }}
                onChange={async (e) => {
                  await updateDoc(doc(db, 'users', uid!), {
                    theme: encrypt(e!.value as string, uid!),
                  });
                }}
              />
              <div className="my-4" />
              <CustomDropdown
                menuPlacement="top"
                data={Object.values(currencies).map((item) => ({
                  label: `${item.symbol} ${item.code}`,
                  value: item.code,
                }))}
                placeholder="Currency"
                value={{
                  label: `${currencies[currency ?? 'USD'].symbol} ${
                    currencies[currency ?? 'USD'].code
                  }`,
                  value: currency ?? 'USD',
                }}
                onChange={async (e) => {
                  await updateDoc(doc(db, 'users', uid!), {
                    currency: encrypt(e!.value as string, uid!),
                  });
                }}
              />
              <div className="my-8" />
            </div>
          </ul>
        </div>
      </aside>
      <button
        type="button"
        style={{
          position: 'absolute',
          zIndex: isOpen ? 1 : -1,
          width: '100vw',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
        onClick={() => {
          dispatch(setSidebar(false));
          document
            .getElementById('default-sidebar')!
            .classList.toggle('-translate-x-full');
        }}
      >
        {' '}
      </button>
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
    </div>
  );
}

export default React.memo(SidebarLayout);
