import React from 'react';
import styles from './title-input.module.scss';

interface ITitleInputProps {
  placeholder: string;
}

const TitleInput: React.FC<ITitleInputProps> = (props) => {
  return <textarea className={styles.textarea}></textarea>;
};

export default TitleInput;
