import React from 'react';
import { COLORS } from '../../Shared/commonStyles';

function CustomButton({
  backgroundColor = COLORS.PRIMARY.VIOLET,
  title,
  onPress,
  textColor = COLORS.LIGHT[100],
  borderWidth = 0,
  borderColor,
  component,
  flex,
  disabled,
}: Readonly<{
  backgroundColor?: string;
  title: string;
  onPress: () => void;
  textColor?: string;
  borderWidth?: number;
  borderColor?: string;
  component?: React.ReactNode;
  flex?: number;
  disabled?: boolean;
}>) {
  return (
    <button
      disabled={disabled ?? false}
      type="button"
      className="flex justify-center min-h-12 md:h-14 hover:opacity-90 items-center disabled:opacity-100 active:opacity-80"
      style={{
        backgroundColor: disabled ? '#bababa' : backgroundColor,
        borderWidth,
        borderColor,
        columnGap: '10px',
        outline: '0px',
        borderRadius: '8px',
        flex,
      }}
      onClick={onPress}
    >
      {component}
      <p
        style={{ color: textColor, alignSelf: 'center' }}
        className="text-md md:text-xl lg:text-2xl"
      >
        {title}
      </p>
    </button>
  );
}

export default React.memo(CustomButton);
