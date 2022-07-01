import React from 'react';

interface KakaoBtnProps {
  title: string;
  onClickBtn: () => void;
}

const KakaoBtn: React.FC<KakaoBtnProps> = ({ title, onClickBtn }) => {
  return <button onClick={onClickBtn}>{title}</button>;
};

export default KakaoBtn;
