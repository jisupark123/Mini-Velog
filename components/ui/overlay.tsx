import React, { ReactNode, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './overlay.module.scss';

interface BackDropProps {
  hasCloseBtn?: boolean;
  onlyCloseWithBtn?: boolean;
  onCloseHandler?: () => void;
  onTop?: boolean;
}

interface OverlayProps extends BackDropProps {
  children: ReactNode;
}

interface ModalProps {
  children: ReactNode;
  onTop?: boolean;
}

const BackDrop: React.FC<BackDropProps> = ({
  hasCloseBtn,
  onlyCloseWithBtn,
  onCloseHandler,
  onTop,
}) => {
  return (
    <div
      className={`${styles.backdrop} ${onTop ? styles['backdrop-onTop'] : ''}`}
      onClick={onlyCloseWithBtn ? () => {} : onCloseHandler}
    >
      {hasCloseBtn && (
        <button className={styles.closeBtn} onClick={onCloseHandler}>
          ✕
        </button>
      )}
    </div>
  );
};

const Modal: React.FC<ModalProps> = ({ children, onTop }) => {
  return (
    <div className={`${styles.modal} ${onTop ? styles['modal-onTop'] : ''}`}>
      {children}
    </div>
  );
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
          <BackDrop
            onCloseHandler={props.onCloseHandler}
            hasCloseBtn={props.hasCloseBtn}
            onlyCloseWithBtn={props.onlyCloseWithBtn}
            onTop={props.onTop}
          />,
          portalElement
        )}
      {portalElement &&
        ReactDOM.createPortal(
          <Modal onTop={props.onTop}>{props.children}</Modal>,
          portalElement
        )}
    </>
  );
};

export default Overlay;
