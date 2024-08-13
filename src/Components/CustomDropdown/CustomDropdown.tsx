import React, { useMemo } from 'react';
import Select, { ActionMeta, SingleValue } from 'react-select';
import { COLORS, PlaceholderTextColor } from '../../Shared/commonStyles';
import useAppTheme from '../../Hooks/themeHook';

function CustomDropdown({
  data,
  value,
  onChange,
  // flex,
  placeholder,
  borderColor,
  menuPlacement = 'auto',
  menuPosition = 'fixed',
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
  menuPosition?: 'absolute' | 'fixed';
}>) {
  const apptheme = useAppTheme();
  const dropdownData = useMemo(
    () =>
      data.map((item) => {
        return {
          label:
            item.value === 'add'
              ? 'ADD NEW CATEGORY'
              : item.label[0].toUpperCase() + item.label.slice(1),
          value: item.value,
        };
      }),
    [data]
  );
  return (
    <Select
      options={dropdownData}
      onChange={onChange}
      placeholder={placeholder}
      value={value}
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          outline: 'none',
          borderColor:
            borderColor ?? (apptheme[0] === 'dark' ? '#7A7E80' : '#bbbbbb'),
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
          color:
            value !== undefined && state.data.value === value.value
              ? 'white'
              : apptheme[1].DARK[100],
          fontWeight: state.data.value === 'add' ? 'bolder' : 'normal',
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
          boxShadow:
            apptheme[0] === 'dark' ? '1px 1px 5px white' : '1px 1px 5px gray',
          scrollbarColor:
            apptheme[0] === 'dark'
              ? `${COLORS.DARK[50]} ${COLORS.DARK[75]}`
              : `${COLORS.LIGHT[20]} ${COLORS.LIGHT[80]}`,
          position: 'absolute',
        }),
        singleValue: (base) => ({ ...base, color: apptheme[1].DARK[100] }),
        indicatorSeparator: () => ({ display: 'none' }),
        dropdownIndicator: (base) => ({
          ...base,
          color: apptheme[0] === 'dark' ? COLORS.LIGHT[20] : COLORS.DARK[50],
        }),
      }}
      menuPlacement={menuPlacement}
      isSearchable={false}
      menuPosition={menuPosition}
      maxMenuHeight={250}
    />
  );
}

export default React.memo(CustomDropdown);
