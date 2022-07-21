import { createContext } from 'react';

export interface NoticeState {
  show: boolean;
  isSuccessed: boolean;
  header: string;
  message: string;
}

export interface NoticeParams {
  header: string;
  message: string;
}

export interface INoticeCtx extends NoticeState {
  successed: (info: NoticeParams) => void;
  failed: (info: NoticeParams) => void;
  close: () => void;
}

const NoticeCtx = createContext<INoticeCtx | undefined>(undefined);

export default NoticeCtx;
