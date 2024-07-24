import React, { useEffect, useMemo, useState } from 'react';
// Third Party Libraries
import Modal from 'react-modal';
import clsx from 'clsx';
import { Timestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
// Custom Components
import CustomButton from '../../../Components/CustomButton';
import CustomDropdown from '../../../Components/CustomDropdown/CustomDropdown';
import { RepeatDataType } from '../../../Defs/transaction';
import {
  FreqDropdownData,
  monthData,
  weekData,
  EndDropdownData,
  STRINGS,
} from '../../../Shared/Strings';
import { EmptyError } from '../../../Shared/errors';
import useAppTheme from '../../../Hooks/themeHook';
import { COLORS } from '../../../Shared/commonStyles';
import { useIsDesktop } from '../../../Hooks/mobileCheckHook';

function RepeatDataModal({
  modal,
  setModal,
  setChecked,
  repeatData,
  setRepeatData,
}: Readonly<{
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
  repeatData: RepeatDataType | undefined;
  setRepeatData: React.Dispatch<
    React.SetStateAction<RepeatDataType | undefined>
  >;
}>) {
  // state
  const [freq, setFreq] = useState<RepeatDataType['freq']>();
  const [end, setEnd] = useState<RepeatDataType['end']>();
  const [day, setDay] = useState<number>(1);
  const [date, setDate] = useState<Date>();
  const [weekDay, setWeekDay] = useState<number>(1);
  const [month, setMonth] = useState<number>(1);
  const [formkey, setFormkey] = useState<boolean>(false);
  const [myDate, setMyDate] = useState<Date>();
  // constants
  const year = new Date().getFullYear();
  const [theme] = useAppTheme();
  const isDesktop = useIsDesktop();
  const today = new Date();
  today.setHours(0);
  // functions
  const daysInYear = useMemo(() => {
    const res = [];
    for (let m = 1; m <= 12; m += 1) {
      let daysInMonth;
      if (m === 2) {
        if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
          daysInMonth = 29;
        } else {
          daysInMonth = 28;
        }
      } else {
        daysInMonth = new Date(year, m, 0).getDate();
      }
      const daysArray = [];
      for (let i = 1; i <= daysInMonth; i += 1) {
        daysArray.push(i);
      }
      res.push({
        month: m,
        days: daysArray,
      });
    }
    return res;
  }, [year]);
  useEffect(() => {
    setFormkey(false);
    setFreq((repeatData?.freq as RepeatDataType['freq']) ?? undefined);
    setMonth(repeatData?.month ?? 1);
    setDay(repeatData?.day ?? 1);
    setWeekDay(repeatData?.weekDay ?? 1);
    setEnd((repeatData?.end as 'date' | 'never') ?? undefined);
    if ((repeatData?.date as Timestamp)?.seconds !== undefined) {
      setDate(
        Timestamp.fromMillis(
          (repeatData?.date as Timestamp).seconds * 1000
        ).toDate()
      );
    } else {
      setDate(repeatData?.date as Date);
    }
  }, [repeatData]);
  useEffect(() => {
    const x = new Date(`${new Date().getFullYear()}-${month}-${day}`);
    x.setDate(x.getDate() + 1);
    setMyDate(x);
  }, [month, day]);
  return (
    <Modal
      isOpen={modal}
      onRequestClose={() => {
        setModal(false);
        if (repeatData === undefined) {
          setChecked(false);
        }
        setFormkey(false);
        setFreq((repeatData?.freq as RepeatDataType['freq']) ?? undefined);
        setMonth(repeatData?.month ?? 1);
        setDay(repeatData?.day ?? 1);
        setWeekDay(repeatData?.weekDay ?? 1);
        setEnd((repeatData?.end as 'date' | 'never') ?? undefined);
        if ((repeatData?.date as Timestamp)?.seconds !== undefined) {
          setDate(
            Timestamp.fromMillis(
              (repeatData?.date as Timestamp).seconds * 1000
            ).toDate()
          );
        } else {
          setDate(repeatData?.date as Date);
        }
      }}
      style={{
        content: {
          width: isDesktop ? '40%' : '80%',
          height: 'min-content',
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          border: 0,
          backgroundColor:
            theme === 'dark' ? COLORS.DARK[100] : COLORS.LIGHT[100],
        },
        overlay: {
          backgroundColor: theme === 'dark' ? '#ffffff30' : '#00000050',
        },
      }}
    >
      <div className="w-full flex flex-col">
        <div className="flex gap-x-4">
          <CustomDropdown
            menuPlacement="bottom"
            placeholder={STRINGS.Frequency}
            flex={1}
            data={FreqDropdownData}
            onChange={(e) => {
              setFreq(e!.value as RepeatDataType['freq']);
            }}
            // menuIsOpen
            value={
              freq
                ? { label: freq[0].toUpperCase() + freq.slice(1), value: freq }
                : undefined
            }
          />
          {freq === 'yearly' && (
            <CustomDropdown
              menuPlacement="bottom"
              placeholder={STRINGS.Month}
              flex={1}
              data={monthData}
              onChange={(e) => {
                setMonth(Number(e!.value));
              }}
              value={month !== undefined ? monthData[month - 1] : undefined}
            />
          )}
          {(freq === 'yearly' || freq === 'monthly') && (
            <CustomDropdown
              menuPlacement="bottom"
              placeholder={STRINGS.Day}
              data={
                freq === 'monthly'
                  ? daysInYear[new Date().getMonth()].days.map((d) => {
                      return {
                        label: String(d),
                        value: d,
                      };
                    })
                  : daysInYear[month - 1].days.map((d) => {
                      return {
                        label: String(d),
                        value: d,
                      };
                    })
              }
              onChange={(e) => {
                setDay(Number(e!.value));
              }}
              value={
                day !== undefined
                  ? { label: String(day), value: day }
                  : undefined
              }
            />
          )}
          {freq === 'weekly' && (
            <CustomDropdown
              menuPlacement="bottom"
              placeholder={STRINGS.Day}
              data={weekData}
              onChange={(e) => {
                setWeekDay(Number(e!.value));
              }}
              value={
                weekDay !== undefined
                  ? { label: weekData[weekDay].label, value: weekDay }
                  : undefined
              }
            />
          )}
        </div>
        <EmptyError
          errorText={STRINGS.PleaseSelectOption}
          formKey={formkey}
          value={freq ?? ''}
        />
        <div className="flex gap-x-4">
          <CustomDropdown
            placeholder={STRINGS.EndAfter}
            data={EndDropdownData}
            onChange={(e) => {
              setEnd(e!.value as RepeatDataType['end']);
            }}
            value={
              end
                ? { label: end[0].toUpperCase() + end.slice(1), value: end }
                : undefined
            }
            flex={1}
          />
          {end === 'date' && (
            <input
              type="date"
              className={clsx(
                'border rounded-lg px-4 bg-transparent min-w-40',
                formkey &&
                  end === 'date' &&
                  (date! < today || date! < myDate!) &&
                  'outline-red-500 outline outline-2 outline-offset-2',
                theme === 'dark' ? 'text-white' : 'text-black'
              )}
              min={
                freq === 'yearly' || freq === 'monthly'
                  ? myDate!.toISOString().split('T')[0]
                  : new Date().toISOString().split('T')[0]
              }
              max={new Date('2050-1-1').toISOString().split('T')[0]}
              value={
                date?.toISOString()?.split('T')?.[0] ??
                (freq === 'yearly' || freq === 'monthly'
                  ? myDate!.toISOString().split('T')[0]
                  : new Date().toISOString().split('T')[0])
              }
              style={{ colorScheme: theme }}
              onChange={(e) => {
                if (!e.target.value) {
                  setDate(new Date());
                } else {
                  const newDate = new Date(e.target.value);
                  if (!Number.isNaN(newDate.getTime())) {
                    setDate(newDate);
                  }
                }
              }}
            />
          )}
        </div>
        <EmptyError
          errorText={STRINGS.PleaseSelectOption}
          formKey={formkey}
          value={end ?? ''}
        />
        <CustomButton
          title={STRINGS.Continue}
          onPress={() => {
            setFormkey(true);
            if (end === 'date' && date! < new Date()) {
              toast.error(
                "The selected end date must be later than today's date."
              );
              return;
            }
            if (end === 'date' && date! < myDate!) {
              toast.error(
                "The selected end date must be later than selected frequency's date."
              );
              return;
            }
            if (freq && end) {
              setRepeatData({
                freq: freq ?? 'daily',
                month,
                day,
                weekDay,
                end: end ?? 'never',
                date: date ?? new Date(),
              });
              setChecked(true);
              setModal(false);
            }
          }}
        />
      </div>
    </Modal>
  );
}

export default React.memo(RepeatDataModal);
