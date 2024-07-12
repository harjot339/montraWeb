import React, { SetStateAction, useMemo, useState } from 'react';
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

function ExportDataModal({
  modal,
  setModal,
}: {
  modal: boolean;
  setModal: React.Dispatch<SetStateAction<boolean>>;
}) {
  const [dataType, setDataType] = useState<
    'all' | 'expense' | 'income' | 'transfer'
  >('all');
  const [dataRange, setDataRange] = useState<7 | 15 | 30>(7);
  const [dataFormat, setDataFormat] = useState<'csv' | 'pdf'>('csv');
  const data = useSelector(
    (state: RootState) => state.transactions.transactions
  );
  const dispatch = useDispatch();
  // Functions
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
          frequency = val.freq.day + monthData[val.freq.month!].label;
        } else if (val.freq?.freq === 'monthly') {
          frequency = String(val.freq.day);
        } else if (val.freq?.freq === 'weekly') {
          frequency = weekData[val.freq.weekDay].label;
        }
        return {
          ...val,
          timeStamp: Timestamp.fromMillis(
            val.timeStamp.seconds * 1000
          ).toDate(),
          freq: `${val.freq?.freq ?? 'never'} ${frequency} ${
            val.freq?.end !== undefined && val.freq.end === 'date'
              ? `,end - ${Timestamp.fromMillis(
                  (val.freq.date as Timestamp).seconds! * 1000
                ).toDate()}`
              : ''
          }`,
        };
      });
  }, [data, dataType, dataRange]);
  return (
    <Modal
      isOpen={modal}
      onRequestClose={() => {
        setModal(false);
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
        <p>{STRINGS.WhatExport}</p>
        <CustomDropdown
          data={['all', 'expense', 'income', 'transfer'].map((item) => {
            return {
              label: item[0].toUpperCase() + item.slice(1),
              value: item,
            };
          })}
          onChange={(e) => {
            setDataType(
              e.target.value as 'all' | 'expense' | 'income' | 'transfer'
            );
          }}
          placeholder=""
          value={dataType}
        />
        <p>{STRINGS.Whendaterange}</p>
        <CustomDropdown
          data={['7', '15', '30'].map((item) => {
            return {
              label: `Last ${item} days`,
              value: item,
            };
          })}
          onChange={(e) => {
            setDataRange(Number(e.target.value) as 7 | 15 | 30);
          }}
          placeholder=""
          value={String(dataRange)}
        />
        <p>{STRINGS.WhatFormat}</p>
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
            setDataFormat(e.target.value as 'csv' | 'pdf');
          }}
          placeholder=""
          value={dataFormat}
        />
        <CustomButton
          title={STRINGS.Export}
          onPress={async () => {
            dispatch(setLoading(true));
            try {
              setModal(false);
              const csvData = jsonToCSV(formatExportData);
              if (csvData === '') {
                toast.error(STRINGS.NoDataToExport);
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
            }
          }}
        />
      </div>
    </Modal>
  );
}

export default ExportDataModal;
