import ArrowDown from '../../assets/svgs/arrow down.svg';
import {
  InputBorderColor,
  PlaceholderTextColor,
} from '../../Shared/commonStyles';

function CustomDropdown({
  data,
  value,
  onChange,
  flex,
  placeholder,
}: Readonly<{
  data: { label: string; value: string | number }[];
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  flex?: number;
  placeholder: string;
}>) {
  return (
    <div
      className="flex bg-transparent border h-12 md:h-14 rounded-lg pr-3"
      style={{ borderColor: InputBorderColor, flex }}
    >
      <select
        className="myDropdown flex-1 bg-transparent outline-none h-12 md:h-14 rounded-lg px-5 appearance-none"
        value={value}
        onChange={onChange}
      >
        <option
          value=""
          style={{ color: PlaceholderTextColor }}
          disabled
          selected
          hidden
        >
          {placeholder}
        </option>
        {data.map((item) => (
          <option key={item.value} value={item.value} className="px-10">
            {item.value === 'add'
              ? 'Add New Category'
              : item.label[0].toUpperCase() + item.label.slice(1)}
          </option>
        ))}
      </select>
      <img src={ArrowDown} width="25px" alt="" />
    </div>
  );
}

export default CustomDropdown;
