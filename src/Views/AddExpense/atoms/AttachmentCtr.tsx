import React, { useState } from 'react';
import Attachment from '../../../assets/svgs/attachment.svg';
import Close from '../../../assets/svgs/close.svg';
import File from '../../../assets/svgs/file.svg';
import { TransactionType } from '../../../Defs/transaction';
import { MimeToExtension } from '../../../Utils/commonFuncs';

function AttachmentCtr({
  img,
  setImg,
  setFile,
  isEdit,
  attachementType,
  attachement,
}: {
  img: File | undefined;
  setImg: React.Dispatch<React.SetStateAction<File | undefined>>;
  setFile: React.Dispatch<
    React.SetStateAction<{
      file: File | undefined;
      type: TransactionType['attachementType'];
    }>
  >;
  isEdit: boolean;
  attachementType: TransactionType['attachementType'] | undefined;
  attachement: string | undefined;
}) {
  const [type, setType] = useState(attachementType);
  return (isEdit && img === undefined && type !== 'none') || img ? (
    <div className="relative">
      {(isEdit && img === undefined && type === 'image') ||
      img?.type.startsWith('image/') ? (
        <img
          src={
            isEdit && img === undefined && type === 'image'
              ? attachement
              : URL.createObjectURL(img!)
          }
          alt=""
          width="300px"
          height="10px"
        />
      ) : (
        <div className="bg-violet-200 p-4 w-32 flex flex-col justify-center rounded-lg items-center">
          <img src={File} alt="" width="40px" />
          <p className="mt-4 overflow-hidden text-ellipsis">
            {isEdit && img === undefined ? 'Document' : img!.name}
          </p>
        </div>
      )}
      <button
        type="button"
        onClick={() => {
          setType('none');
          setImg(undefined);
        }}
      >
        <img
          src={Close}
          alt=""
          className="absolute bg-[#00000050] rounded-full left-1 top-1"
          width="30px"
        />
      </button>
    </div>
  ) : (
    <>
      <input
        type="file"
        id="fileElem"
        accept="image/*,.doc,.docx,.pdf,.txt,.xls,.xlsx"
        className="hidden"
        onChange={(e) => {
          setImg(e.target.files?.[0]);
          setFile({
            file: e.target.files?.[0],
            type: e.target.files![0].type.startsWith('image')
              ? 'image'
              : (MimeToExtension[
                  e.target.files![0].type
                ] as TransactionType['attachementType']),
          });
        }}
      />
      <button
        type="button"
        className="bg-transparent h-12 md:h-14 w-full border rounded-lg border-dashed flex justify-center items-center"
        onClick={() => {
          const fileElem = document.getElementById('fileElem');
          fileElem?.click();
        }}
      >
        <img src={Attachment} alt="" />
        <p className="text-lg text-[#7A7E80] font-semibold">Add Attachement</p>
      </button>
    </>
  );
}

export default React.memo(AttachmentCtr);
