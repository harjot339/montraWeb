import React, { SetStateAction, useCallback, useMemo, useState } from 'react';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { jsonToCSV } from 'react-papaparse';
import { useDispatch, useSelector } from 'react-redux';
import { Timestamp } from 'firebase/firestore';
import CustomButton from '../../../Components/CustomButton';
import { monthData, STRINGS, weekData } from '../../../Shared/Strings';
import CustomDropdown from '../../../Components/CustomDropdown';
import { RootState } from '../../../Store';
import { setLoading } from '../../../Store/Loader';
import useAppTheme from '../../../Hooks/themeHook';
import { COLORS } from '../../../Shared/commonStyles';
import { useIsDesktop } from '../../../Hooks/mobileCheckHook';
import { convertLastNdaysText } from '../../../localization';

function ExportDataModal({
  modal,
  setModal,
}: Readonly<{
  modal: boolean;
  setModal: React.Dispatch<SetStateAction<boolean>>;
}>) {
  const [theme] = useAppTheme();
  const isDesktop = useIsDesktop();
  // state
  const [dataType, setDataType] = useState<
    'all' | 'expense' | 'income' | 'transfer'
  >('all');
  const [dataRange, setDataRange] = useState<7 | 15 | 30>(7);
  const [dataFormat, setDataFormat] = useState<'csv' | 'pdf'>('csv');
  // redux
  const data = useSelector(
    (state: RootState) => state.transactions.transactions
  );
  const dispatch = useDispatch();
  // functions
  const formatExportData = useMemo(() => {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - dataRange);
    return Object.values(data)
      .filter(
        (item) =>
          Timestamp.fromMillis(item.timeStamp.seconds * 1000).toDate() >
            daysAgo && (dataType === 'all' ? true : dataType === item.type)
      )
      .map((val) => {
        if (val.type === 'transfer') {
          return {
            ...val,
            timeStamp: Timestamp.fromMillis(
              val.timeStamp.seconds * 1000
            ).toDate(),
          };
        }
        let frequency = '';
        if (val.freq?.freq === 'yearly') {
          frequency = val.freq.day + monthData(STRINGS)[val.freq.month!].label;
        } else if (val.freq?.freq === 'monthly') {
          frequency = String(val.freq.day);
        } else if (val.freq?.freq === 'weekly') {
          frequency = weekData(STRINGS)[val.freq.weekDay].label;
        }
        return {
          ...val,
          timeStamp: Timestamp.fromMillis(
            val.timeStamp.seconds * 1000
          ).toDate(),
          freq: `${val.freq?.freq ?? 'never'} ${frequency} ${
            val.freq?.end !== undefined && val.freq.end === 'date'
              ? `,end - ${Timestamp.fromMillis(
                  (val.freq.date as Timestamp).seconds * 1000
                ).toDate()}`
              : ''
          }`,
        };
      });
  }, [data, dataType, dataRange]);
  const handleExport = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      setModal(false);
      const csvData = jsonToCSV(formatExportData);
      if (csvData === '') {
        toast.error(STRINGS.NoDataToExport);
        toast.clearWaitingQueue();
        dispatch(setLoading(false));
        return;
      }
      window.URL = window.webkitURL || window.URL;
      const contentType = 'text/csv';
      const csvFile = new Blob([csvData], { type: contentType });
      window.open(URL.createObjectURL(csvFile), '_blank');
      dispatch(setLoading(false));
    } catch (e) {
      toast.error(e as string);
      toast.clearWaitingQueue();
      dispatch(setLoading(false));
    }
  }, [dispatch, formatExportData, setModal]);

  return (
    <Modal
      isOpen={modal}
      onRequestClose={() => {
        setModal(false);
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
          backgroundColor:
            theme === 'dark' ? COLORS.DARK[100] : COLORS.LIGHT[100],
          border: 0,
          color: theme === 'dark' ? COLORS.LIGHT[100] : COLORS.DARK[100],
        },
        overlay: {
          backgroundColor: theme === 'dark' ? '#ffffff30' : '#00000050',
        },
      }}
    >
      <div className="w-full flex flex-col py-5 px-5 md:px-10">
        <p className="text-lg sm:text-xl md:text-2xl my-2">
          {STRINGS.WhatExport}
        </p>
        <CustomDropdown
          data={['all', 'expense', 'income', 'transfer'].map((item) => {
            return {
              label:
                STRINGS?.[item[0].toUpperCase() + item.slice(1)] ??
                item[0].toUpperCase() + item.slice(1),
              value: item,
            };
          })}
          onChange={(e) => {
            setDataType(e!.value as 'all' | 'expense' | 'income' | 'transfer');
          }}
          placeholder=""
          value={
            dataType
              ? {
                  label:
                    STRINGS?.[dataType[0].toUpperCase() + dataType.slice(1)] ??
                    dataType[0].toUpperCase() + dataType.slice(1),
                  value: dataType,
                }
              : undefined
          }
        />
        <p className="text-lg sm:text-xl md:text-2xl mt-4 mb-2">
          {STRINGS.Whendaterange}
        </p>
        <CustomDropdown
          data={['7', '15', '30'].map((item) => {
            return {
              label: convertLastNdaysText(STRINGS, item),
              value: item,
            };
          })}
          onChange={(e) => {
            setDataRange(Number(e!.value) as 7 | 15 | 30);
          }}
          placeholder=""
          value={
            dataRange
              ? {
                  label: convertLastNdaysText(STRINGS, dataRange),
                  value: String(dataRange),
                }
              : undefined
          }
        />
        <p className="text-lg sm:text-xl md:text-2xl mt-4 mb-2">
          {STRINGS.WhatFormat}
        </p>
        <CustomDropdown
          data={[
            'csv',
            //  'pdf'
          ].map((item) => {
            return {
              label: item.toUpperCase(),
              value: item,
            };
          })}
          onChange={(e) => {
            setDataFormat(e!.value as 'csv' | 'pdf');
          }}
          placeholder=""
          value={
            dataFormat
              ? {
                  label: dataFormat.toUpperCase(),
                  value: dataFormat,
                }
              : undefined
          }
        />
        <div className="my-4" />
        <CustomButton title={STRINGS.Export} onPress={handleExport} />
      </div>
    </Modal>
  );
}

export default ExportDataModal;
