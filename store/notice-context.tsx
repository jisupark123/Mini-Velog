import { createContext, useContext } from 'react';
import React, { useState } from 'react';

interface State {
  show: boolean;
  isSuccessed: boolean;
  message: string;
  successed: (message: string) => void;
  failed: (message: string) => void;
  close: () => void;
}

const defaultState: State = {
  show: false,
  isSuccessed: false,
  message: '',
  successed: () => {},
  failed: () => {},
  close: () => {},
};

const StateContext = createContext(defaultState);
const NoticeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState(defaultState);
  const successed = (message: string) => {
    setState((prev) => ({
      ...prev,
      show: true,
      isSuccessed: true,
      message,
    }));
  };
  const failed = (message: string) => {
    setState((prev) => ({
      ...prev,
      show: true,
      isSuccessed: false,
      message,
    }));
  };
  const close = () => {
    setState(defaultState);
  };

  const noticeCtx: State = {
    show: state.show,
    isSuccessed: state.isSuccessed,
    message: state.message,
    successed,
    failed,
    close,
  };
  return (
    <StateContext.Provider value={noticeCtx}>{children}</StateContext.Provider>
  );
};

export const useNotice = () => {
  return useContext(StateContext);
};

export default NoticeProvider;
