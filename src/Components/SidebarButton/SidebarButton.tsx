import { useDispatch } from 'react-redux';
import clsx from 'clsx';
import { setSidebar } from '../../Store/Loader';
import { useIsMobile } from '../../Hooks/mobileCheckHook';
import useAppTheme from '../../Hooks/themeHook';

function SidebarButton() {
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const [theme] = useAppTheme();
  return (
    isMobile && (
      <button
        type="button"
        className={clsx(
          'p-2 rounded-lg',
          theme === 'dark' ? 'bg-black' : 'bg-white'
        )}
        onClick={() => {
          dispatch(setSidebar(true));
          document
            .getElementById('default-sidebar')!
            .classList.toggle('-translate-x-full');
        }}
      >
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill={theme === 'dark' ? 'white' : 'black'}
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
    )
  );
}

export default SidebarButton;
