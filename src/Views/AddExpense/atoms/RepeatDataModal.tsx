import React, { useEffect, useMemo, useState } from 'react';
import Modal from 'react-modal';
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

function RepeatDataModal({
  modal,
  setModal,
  setChecked,
  repeatData,
  setRepeatData,
}: {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
  repeatData: RepeatDataType | undefined;
  setRepeatData: React.Dispatch<
    React.SetStateAction<RepeatDataType | undefined>
  >;
}) {
  const [freq, setFreq] = useState<RepeatDataType['freq']>();
  const [end, setEnd] = useState<RepeatDataType['end']>();
  const [day, setDay] = useState<number>(1);
  const [date, setDate] = useState<Date>();
  const [weekDay, setWeekDay] = useState<number>(1);
  const [month, setMonth] = useState<number>(1);
  const [formkey, setFormkey] = useState<boolean>(false);
  // constants
  const year = new Date().getFullYear();
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
      for (let d = 1; d <= daysInMonth; d += 1) {
        daysArray.push(d);
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
    setDate(repeatData?.date as Date);
  }, [repeatData]);
  return (
    <Modal
      isOpen={modal}
      onRequestClose={() => {
        setModal(false);
        if (repeatData === undefined) {
          setChecked(false);
        }
      }}
      style={{
        content: {
          width: 'min-content',
          height: 'min-content',
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        },
        overlay: {
          backgroundColor: '#00000050',
        },
      }}
    >
      <div style={{ width: '30vw', display: 'flex', flexDirection: 'column' }}>
        <div className="flex gap-x-4">
          <CustomDropdown
            placeholder={STRINGS.Frequency}
            flex={1}
            data={FreqDropdownData}
            onChange={(e) => {
              setFreq(e.target.value as RepeatDataType['freq']);
            }}
            value={freq ?? ''}
          />
          {freq === 'yearly' && (
            <CustomDropdown
              placeholder={STRINGS.Month}
              flex={1}
              data={monthData}
              onChange={(e) => {
                setMonth(Number(e.target.value));
              }}
              value={month}
            />
          )}
          {(freq === 'yearly' || freq === 'monthly') && (
            <CustomDropdown
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
                setDay(Number(e.target.value));
              }}
              value={day}
            />
          )}
          {freq === 'weekly' && (
            <CustomDropdown
              placeholder={STRINGS.Day}
              data={weekData}
              onChange={(e) => {
                setWeekDay(Number(e.target.value));
              }}
              value={weekDay}
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
              setEnd(e.target.value as RepeatDataType['end']);
            }}
            value={end ?? ''}
            flex={1}
          />
          {end === 'date' && (
            <input
              type="date"
              className="border rounded-lg px-4"
              min={new Date().toISOString().split('T')[0]}
              value={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setDate(new Date(e.target.value));
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
          title="Continue"
          onPress={() => {
            setFormkey(true);
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
