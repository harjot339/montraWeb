import React, { useState } from 'react';
import { COLORS } from '../../Shared/commonStyles';
import Show from '../../assets/svgs/eye-off.svg';
import Hide from '../../assets/svgs/eye.svg';

function CustomPassInput({
  value,
  onChange,
  placeholderText,
  maxLength = 100,
  inputColor = COLORS.DARK[100],
}: Readonly<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholderText: string;
  maxLength?: number;
  inputColor?: string;
  flex?: number;
  editable?: boolean;
  onPress?: () => void;
}>) {
  const [hide, setHide] = useState(false);
  const handleHide = () => {
    setHide((b) => !b);
  };
  return (
    <div className="border-b border-r border-l border-t rounded-lg border-[#F1F1FA] flex">
      <input
        style={{
          color: inputColor,
        }}
        className=" px-5 h-12 md:h-14 outline-none w-11/12 rounded-lg"
        placeholder={placeholderText}
        type={hide ? 'text' : 'password'}
        value={value}
        maxLength={maxLength}
        onChange={onChange}
      />
      <button
        type="button"
        className="bg-transparent inline self-center mr-3"
        onClick={handleHide}
      >
        <img src={hide ? Hide : Show} alt="" width="25px" />
      </button>
    </div>
  );
}

export default React.memo(CustomPassInput);
