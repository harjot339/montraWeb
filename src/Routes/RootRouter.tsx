import { useDispatch, useSelector } from 'react-redux';
import { useRoutes } from 'react-router-dom';
import { useEffect } from 'react';
import DocumentTitle from './DocumentTitle';
import { authenticatedRoutes, guestRoutes } from './config';
import AppLayout from '../Components/Layouts/AppLayout';
import type { RootState } from '../Store';
import { useGetUsdConversionQuery } from '../Services/Api/module/converApi';
import { setConversionData } from '../Store/Common';
import { currencies } from '../Shared/Strings';

function RootRouter() {
  const guest = useRoutes(guestRoutes);
  const authenticated = useRoutes(authenticatedRoutes);
  const uid = useSelector((state: RootState) => state?.common?.user?.uid);
  const isAuthenticated = !!uid;
  const { data: conversion, isSuccess } = useGetUsdConversionQuery({});
  const dispatch = useDispatch();
  useEffect(() => {
    if (isSuccess) {
      const myCurrencies: { [key: string]: number } = {};
      Object.entries(conversion.usd as { [key: string]: number }).forEach(
        ([key, val]) => {
          if (currencies[key.toUpperCase()] !== undefined) {
            myCurrencies[key] = val;
          }
        }
      );
      dispatch(
        setConversionData({
          date: conversion.date,
          usd: myCurrencies,
        })
      );
    }
  }, [conversion, dispatch, isSuccess]);
  return (
    <>
      <DocumentTitle isAuthenticated={isAuthenticated} />
      <AppLayout isAuthenticated={isAuthenticated}>
        {uid ? authenticated : guest}
      </AppLayout>
    </>
  );
}

export default RootRouter;
