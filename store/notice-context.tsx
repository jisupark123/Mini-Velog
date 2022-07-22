import { createContext, useContext } from 'react';
import React, { useState } from 'react';

interface State {
  show: boolean;
  isSuccessed: boolean;
  header: string;
  message: string;
  successed: (info: Info) => void;
  failed: (info: Info) => void;
  close: () => void;
}

export interface Info {
  header: string;
  message: string;
}

const defaultState: State = {
  show: false,
  isSuccessed: false,
  header: '',
  message: '',
  successed: (info: Info) => {},
  failed: (info: Info) => {},
  close: () => {},
};

const StateContext = createContext(defaultState);
const NoticeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState(defaultState);
  const successed = (info: Info) => {
    setState((prev) => ({
      ...prev,
      show: true,
      isSuccessed: true,
      header: info.header,
      message: info.message,
    }));
  };
  const failed = (info: Info) => {
    setState((prev) => ({
      ...prev,
      show: true,
      isSuccessed: false,
      header: info.header,
      message: info.message,
    }));
  };
  const close = () => {
    setState(defaultState);
  };

  const noticeCtx: State = {
    show: state.show,
    isSuccessed: state.isSuccessed,
    header: state.header,
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
