import { COLORS } from '../../Shared/commonStyles';

function CustomButton({
  backgroundColor = COLORS.PRIMARY.VIOLET,
  title,
  onPress,
  textColor = COLORS.LIGHT[100],
  borderWidth = 0,
  borderColor,
  component,
}: Readonly<{
  backgroundColor?: string;
  title: string;
  onPress: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  textColor?: string;
  borderWidth?: number;
  borderColor?: string;
  component?: React.ReactNode;
}>) {
  return (
    <button
      type="button"
      className="flex justify-center h-10 md:h-14"
      style={{
        backgroundColor,
        borderWidth,
        borderColor,
        columnGap: '10px',
        alignItems: 'center',
        outline: '0px',
        borderRadius: '8px',
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

export default CustomButton;
