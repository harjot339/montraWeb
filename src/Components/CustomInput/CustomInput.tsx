import { COLORS } from '../../Shared/commonStyles';

function CustomInput({
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
  return (
    <input
      style={{
        color: inputColor,
      }}
      className="border-b border-r border-l border-t rounded-lg border-[#F1F1FA] px-5 h-12 md:h-14 outline-none "
      placeholder={placeholderText}
      value={value}
      maxLength={maxLength}
      onChange={onChange}
    />
  );
}

export default CustomInput;
