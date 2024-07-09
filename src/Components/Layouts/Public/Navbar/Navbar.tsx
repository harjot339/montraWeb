/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { COLORS } from '../../../../Shared/commonStyles';
import { auth } from '../../../../Utils/firebaseConfig';
import { setUser } from '../../../../Store/Common';

export function SidebarLayout({ children }: { children: React.JSX.Element }) {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  return (
    <>
      <aside
        id="default-sidebar"
        className="fixed top-0 left-0 z-40 w-48 h-screen transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <span className="ms-3">Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <span className="flex-1 ms-3 whitespace-nowrap">
                  Transactions
                </span>
              </a>
            </li>

            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <span className="flex-1 ms-3 whitespace-nowrap">Budgets</span>
              </a>
            </li>
            <li>
              <a
                href="#"
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <span className="flex-1 ms-3 whitespace-nowrap">Profile</span>
              </a>
            </li>
            <li>
              <a
                onClick={async () => {
                  await signOut(auth);
                  dispatch(setUser(undefined));
                }}
                href="."
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <span className="flex-1 ms-3 whitespace-nowrap">Signout</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
      <div
        style={{
          position: 'absolute',
          zIndex: isOpen ? 1 : -1,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
        onClick={() => {
          setIsOpen(false);
          const sidebar = document.getElementById('default-sidebar');
          sidebar!.classList.toggle('-translate-x-full');
        }}
      />
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="flex items-center p-2 w-screen text-sm text-gray-500 sm:hidden focus:outline-none  dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        id="toggleSidebarButton"
        onClick={() => {
          setIsOpen(true);
          const sidebar = document.getElementById('default-sidebar');
          sidebar!.classList.toggle('-translate-x-full');
        }}
      >
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          />
        </svg>
      </button>
      <div
        style={{
          width: '100vw',
          height: '100%',
          backgroundColor: COLORS.LIGHT[40],
        }}
      >
        {children}
      </div>
    </>
  );
}

export default SidebarLayout;
