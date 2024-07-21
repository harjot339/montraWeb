import React, { SetStateAction } from 'react';
import clsx from 'clsx';
import { formatWithCommas } from '../../Utils/commonFuncs';
import { currencies } from '../../Shared/Strings';

function MoneyInput({
  amount,
  setAmount,
  theme,
  currency,
}: Readonly<{
  amount: string;
  setAmount: React.Dispatch<SetStateAction<string>>;
  theme: 'light' | 'dark';
  currency: string | undefined;
}>) {
  return (
    <input
      // type="number"
      onClick={() => {
        if (amount === '0') {
          setAmount('');
        }
      }}
      onBlur={() => {
        if (amount === '') {
          setAmount('0');
        }
      }}
      value={`${currencies[currency ?? 'USD'].symbol} ${amount}`}
      className={clsx(
        'bg-transparent w-full px-4 sm:px-8 h-20 outline-none text-6xl font-semibold',
        theme === 'dark' ? 'text-black' : 'text-white'
      )}
      maxLength={12}
      onChange={(e) => {
        const str = e.target.value;
        let numericValue = str.replace(/[^0-9.]+/g, '');
        if (str === '.') {
          return;
        }
        const decimalCount = numericValue.split('.').length - 1;

        if (decimalCount > 1) {
          const parts = numericValue.split('.');
          numericValue = `${parts[0]}.${parts.slice(1).join('')}`;
        }

        if (numericValue.length > 0 && numericValue.endsWith('.')) {
          // Allow only if it is not the only character
          if (
            numericValue.length === 1 ||
            numericValue[numericValue.length - 2] === '.'
          ) {
            numericValue = numericValue.slice(0, -1);
          }
        }

        // Limit to 2 digits after decimal point
        if (decimalCount === 1) {
          const parts = numericValue.split('.');
          if (parts[1].length > 2) {
            numericValue = `${parts[0]}.${parts[1].slice(0, 2)}`;
          }
        }

        if (decimalCount === 1 && numericValue.length > 9) {
          // Adjusted to account for the two decimal places
          numericValue = numericValue.slice(0, 9);
        } else if (decimalCount === 0 && numericValue.length > 7) {
          numericValue = numericValue.slice(0, 7);
        }

        setAmount(formatWithCommas(numericValue));
      }}
    />
  );
}

export default MoneyInput;
