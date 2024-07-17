import React from 'react';
import Select, { ActionMeta, SingleValue } from 'react-select';
import {
  InputBorderColor,
  PlaceholderTextColor,
} from '../../Shared/commonStyles';
import useAppTheme from '../../Hooks/themeHook';

function CustomDropdown({
  data,
  value,
  onChange,
  // flex,
  placeholder,
  borderColor = InputBorderColor,
  menuPlacement = 'auto',
}: Readonly<{
  data: { label: string; value: string | number }[];
  value: { label: string; value: string | number } | undefined;
  onChange: (
    newValue: SingleValue<{
      label: string;
      value: string | number;
    }>,
    actionMeta: ActionMeta<{
      label: string;
      value: string | number;
    }>
  ) => void;
  flex?: number;
  placeholder: string;
  borderColor?: string;
  menuPlacement?: 'top' | 'bottom' | 'auto';
}>) {
  const apptheme = useAppTheme();
  return (
    <Select
      options={data.map((item) => {
        return {
          label:
            item.value === 'add'
              ? 'Add New Category'
              : item.label[0].toUpperCase() + item.label.slice(1),
          value: item.value,
        };
      })}
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          outline: 'none',
          borderColor,
          height: '56px',
          borderRadius: '8px',
          padding: '0px 10px',
          backgroundColor: 'transparent',
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor:
            value !== undefined && state.data.value === value.value
              ? apptheme[1].VIOLET[60]
              : apptheme[1].LIGHT[100],
          color: apptheme[1].DARK[100],
        }),
        placeholder: (base) => ({
          ...base,
          color: PlaceholderTextColor,
        }),
        container: (base) => ({
          ...base,
          width: '100%',
        }),
        menu: (base) => ({
          ...base,
          backgroundColor: apptheme[1].LIGHT[100],
        }),
        singleValue: (base) => ({ ...base, color: apptheme[1].DARK[100] }),
        indicatorSeparator: () => ({ display: 'none' }),
      }}
      menuPlacement={menuPlacement}
      isSearchable={false}
    />
  );
}

export default React.memo(CustomDropdown);
