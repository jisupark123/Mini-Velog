import React, { ReactNode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './overlay.module.scss';

interface BackDropProps {
  onCloseHandler: () => void;
}

interface OverlayProps {
  children: ReactNode;
  onCloseHandler: () => void;
}

interface ModalProps {
  children: ReactNode;
}

const BackDrop: React.FC<BackDropProps> = ({ onCloseHandler }) => {
  return <div className={styles.backdrop} onClick={onCloseHandler}></div>;
};

const Modal: React.FC<ModalProps> = ({ children }) => {
  return <div className={styles.modal}>{children}</div>;
};

const Overlay: React.FC<OverlayProps> = (props) => {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setPortalElement(document.getElementById('overlay'));
  }, []);
  return (
    <>
      {portalElement &&
        ReactDOM.createPortal(
          <BackDrop onCloseHandler={props.onCloseHandler} />,
          portalElement
        )}
      {portalElement &&
        ReactDOM.createPortal(<Modal>{props.children}</Modal>, portalElement)}
    </>
  );
};

export default Overlay;
