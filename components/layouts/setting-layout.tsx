import React from 'react';
import Switch from '../btn/switch';
import styles from './setting-layout.module.scss';

interface SettingLayoutProps {
  title: string;
  state: boolean;
  description: string;
  handleClick: () => void;
}

const SettingLayout: React.FC<SettingLayoutProps> = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.row1}>
        <div className={styles.title}>{props.title}</div>
        <div className={styles.switch}>
          <Switch handleClick={props.handleClick} state={props.state} />
        </div>
      </div>
      <div className={styles.description}>
        <p>{props.description}</p>
      </div>
    </div>
  );
};

export default SettingLayout;
