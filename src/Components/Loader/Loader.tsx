import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Store';
import './styles.css';

function Loader({ children }: Readonly<{ children: React.JSX.Element }>) {
  // redux
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  return isLoading ? (
    <>
      {children}
      <div
        style={{
          display: 'flex',
          position: 'fixed',
          flex: 1,
          top: 0,
          zIndex: 99999,
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.7)',
        }}
      >
        <div className="loader" />
      </div>
    </>
  ) : (
    children
  );
}

export default React.memo(Loader);
