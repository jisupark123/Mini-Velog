import { createContext, useContext } from 'react';
import React, { useState } from 'react';

interface ShowConfirmParams {
  message: string;
  handleOk: () => void;
}

interface State {
  show: boolean;
  message: string;
  showConfirm: (obj: ShowConfirmParams) => void;
  okClicked: () => void;
  cancelClicked: () => void;
}

const defaultState: State = {
  show: false,
  message: '',
  showConfirm: () => {},
  okClicked: () => {},
  cancelClicked: () => {},
};

const StateContext = createContext(defaultState);
const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState(defaultState);
  const showConfirm = (obj: ShowConfirmParams) => {
    setState((prev) => ({
      ...prev,
      show: true,
      message: obj.message,
      okClicked: () => {
        obj.handleOk();
        setState(defaultState);
      },
    }));
  };

  const cancelClicked = () => {
    setState(defaultState);
  };

  const ConfirmCtx: State = {
    show: state.show,
    message: state.message,
    okClicked: state.okClicked,
    showConfirm,
    cancelClicked,
  };
  return (
    <StateContext.Provider value={ConfirmCtx}>{children}</StateContext.Provider>
  );
};

export const useConfirm = () => {
  return useContext(StateContext);
};

export default ConfirmProvider;
