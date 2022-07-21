import React, { useState } from 'react';
import NoticeCtx, {
  INoticeCtx,
  NoticeParams,
  NoticeState,
} from './notice-context';

type Props = {
  children: React.ReactNode;
};

const defaultNoticeState: NoticeState = {
  show: false,
  isSuccessed: false,
  header: '',
  message: '',
};
const NoticeProvider: React.FC<Props> = ({ children }) => {
  const [state, setState] = useState(defaultNoticeState);
  const successed = (info: NoticeParams) => {
    setState({
      show: true,
      isSuccessed: true,
      header: info.header,
      message: info.message,
    });
  };
  const failed = (info: NoticeParams) => {
    setState({
      show: true,
      isSuccessed: false,
      header: info.header,
      message: info.message,
    });
  };
  const close = () => {
    setState(defaultNoticeState);
  };
  const noticeCtx: INoticeCtx = {
    show: state.show,
    isSuccessed: state.isSuccessed,
    header: state.header,
    message: state.message,
    successed,
    failed,
    close,
  };
  return <NoticeCtx.Provider value={noticeCtx}>{children}</NoticeCtx.Provider>;
};

export default NoticeProvider;
