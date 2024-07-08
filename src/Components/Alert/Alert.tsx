import React from 'react';
import CustomButton from '../CustomButton';
import { COLORS } from '../../Shared/commonStyles';

function Alert({
  children,
  show,
  text1,
  text2,
  buttonText1,
  buttonText2,
  buttonOnPress1,
  buttonOnPress2,
}: Readonly<{
  children: React.JSX.Element;
  show: boolean;
  text1: string;
  text2: string;
  buttonText1: string;
  buttonText2: string;
  buttonOnPress1: () => void;
  buttonOnPress2: () => void;
  setAlert: React.Dispatch<React.SetStateAction<boolean>>;
}>) {
  return show ? (
    <>
      {children}
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          flex: 1,
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}
      >
        <div className="bg-white max-w-2xl px-10 py-10 rounded-lg text-center">
          <p className="text-4xl mb-5">{text1}</p>
          <p className="text-xl">{text2}</p>
          <div className="flex flex-row gap-8 mt-8 mx-16">
            <div className="flex flex-1">
              <CustomButton
                title={buttonText1}
                onPress={buttonOnPress1}
                flex={1}
                backgroundColor={COLORS.VIOLET[20]}
                textColor={COLORS.VIOLET[100]}
              />
            </div>
            <div className=" flex flex-1">
              <CustomButton
                title={buttonText2}
                onPress={buttonOnPress2}
                flex={1}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    children
  );
}

export default Alert;
