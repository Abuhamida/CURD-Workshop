import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuthState } from '../store/reducers/authSlice';

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthState());
  }, [dispatch]);

  return <>{children}</>;
};

export default AuthInitializer;