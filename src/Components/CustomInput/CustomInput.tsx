// import { useMemo } from 'react';
import { COLORS } from '../../Shared/commonStyles';
import './styles.css';

function CustomInput({
  value,
  onChange,
  //   type,
  placeholderText,
  maxLength = 100,
  inputColor = COLORS.DARK[100],
}: Readonly<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  //   type: 'email' | 'name' | 'sentence';
  placeholderText: string;
  maxLength?: number;
  inputColor?: string;
  flex?: number;
  editable?: boolean;
  onPress?: () => void;
}>) {
  //   const autoCapitalize = useMemo(() => {
  //     if (type === 'name') {
  //       return 'words';
  //     }
  //     if (type === 'sentence') {
  //       return 'sentences';
  //     }
  //     return 'none';
  //   }, [type]);
  return (
    <input
      style={{
        color: inputColor,
      }}
      className="border-b border-r border-l border-t rounded-lg border-[#F1F1FA] px-5 h-10 md:h-14 outline-none "
      placeholder={placeholderText}
      value={value}
      maxLength={maxLength}
      //   autoCapitalize={autoCapitalize}
      onChange={onChange}
    />
  );
}

export default CustomInput;
