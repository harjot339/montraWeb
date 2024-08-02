import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { formatWithCommas } from '../../Utils/commonFuncs';
import { currencies } from '../../Shared/Strings';

function MoneyInput({
  amount,
  setAmount,
  theme,
  currency,
  isEdit,
  editAmt,
}: Readonly<{
  amount: string;
  setAmount: React.Dispatch<SetStateAction<string>>;
  theme: 'light' | 'dark';
  currency: string | undefined;
  isEdit: boolean;
  editAmt?: string;
}>) {
  const getMaxLengths = () => {
    const parts = editAmt!.replace(/[^0-9.]+/g, '').split('.');
    if (isEdit && parts[0].length > 7) {
      return {
        beforeDecimal: parts[0].length,
        afterDecimal: 2,
      };
    }
    return {
      beforeDecimal: 7,
      afterDecimal: 2,
    };
  };

  const { beforeDecimal, afterDecimal } = getMaxLengths();
  const [cursor, setCursor] = useState<number | null>(null);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const input = ref.current;
    if (input) input.setSelectionRange(cursor, cursor);
  }, [ref, cursor, amount]);
  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      if (
        numericValue.length === 1 ||
        numericValue[numericValue.length - 2] === '.'
      ) {
        numericValue = numericValue.slice(0, -1);
      }
    }

    if (decimalCount === 1) {
      const parts = numericValue.split('.');
      if (parts[1].length > afterDecimal) {
        numericValue = `${parts[0]}.${parts[1].slice(0, afterDecimal)}`;
      }
    }

    const beforeDecimalPart = numericValue.split('.')[0];
    if (beforeDecimalPart.length > beforeDecimal) {
      const parts = numericValue.split('.');
      numericValue = parts[0].slice(0, beforeDecimal);
      if (parts[1]) {
        numericValue += `.${parts[1].slice(0, afterDecimal)}`;
      }
    }

    setAmount(formatWithCommas(numericValue));
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCursor(e.target.selectionStart);
    onTextChange(e);
  };

  return (
    <div className="flex items-center px-4 sm:px-8  w-full">
      <p
        className={clsx(
          'font-semibold',
          currencies[currency ?? 'USD'].symbol.length + amount.length > 10
            ? 'text-[42px]'
            : 'text-6xl',
          theme === 'dark' ? 'text-black' : 'text-white'
        )}
      >
        {currencies[currency ?? 'USD'].symbol}{' '}
      </p>
      <input
        ref={ref}
        onPaste={(e) => {
          e.preventDefault();
        }}
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
        value={amount}
        className={clsx(
          'bg-transparent w-full h-20 outline-none  font-semibold',
          currencies[currency ?? 'USD'].symbol.length + amount.length > 10
            ? 'text-[42px]'
            : 'text-6xl',
          theme === 'dark' ? 'text-black' : 'text-white'
        )}
        // maxLength={12 + currencies[currency ?? 'USD'].symbol.length + 1}
        onChange={handleChange}
      />
    </div>
  );
}

export default React.memo(MoneyInput);
