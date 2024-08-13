import React, { SetStateAction, useState } from 'react';
import Close from '../../assets/svgs/close.svg';
import Income from '../../assets/svgs/income.svg';
import Expense from '../../assets/svgs/expense.svg';
import Transfer from '../../assets/svgs/currency-exchange.svg';

function SpeedDial({
  openScreen,
  setPageType,
}: Readonly<{
  openScreen: React.Dispatch<SetStateAction<boolean>>;
  setPageType: React.Dispatch<
    SetStateAction<'income' | 'expense' | 'transfer' | undefined>
  >;
}>) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div data-dial-init className="fixed end-6 bottom-6 group">
      <div
        id="speed-dial-menu-click"
        className={`flex flex-col items-center transition-transform ${
          isOpen ? 'mb-4 space-y-2' : 'hidden'
        }`}
      >
        <button
          type="button"
          className="flex justify-center items-center w-[52px] h-[52px] bg-[#00A86B] rounded-full"
          onClick={() => {
            setPageType('income');
            openScreen(true);
          }}
        >
          <img src={Income} alt="Income" />
        </button>
        <button
          type="button"
          className="flex justify-center items-center w-[52px] h-[52px] bg-[#0077FF] rounded-full"
          onClick={() => {
            setPageType('transfer');
            openScreen(true);
          }}
        >
          <img src={Transfer} alt="Transfer" />
        </button>
        <button
          type="button"
          className="flex justify-center items-center w-[52px] h-[52px] bg-[#FD3C4A] rounded-full"
          onClick={() => {
            setPageType('expense');
            openScreen(true);
          }}
        >
          <img src={Expense} alt="Expense" />
        </button>
      </div>
      <button
        type="button"
        onClick={toggleMenu}
        className="flex items-center justify-center text-white bg-[#7F3DFF] rounded-full w-14 h-14"
      >
        <img
          src={Close}
          alt="Toggle Menu"
          className={`transition-transform ${isOpen ? '' : '-rotate-45'}`}
        />
      </button>
    </div>
  );
}

export default React.memo(SpeedDial);
