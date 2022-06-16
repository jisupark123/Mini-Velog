import TitleInput from './TiltleInput';
import styles from './newPostForm.module.scss';
import { useRef } from 'react';

const NewPostForm = () => {
  function postUploadHandler() {
    const titleInput = titleInputRef.current!.value;
    const contentsInput = contentsInputRef.current!.value;
  }
  const titleInputRef = useRef<HTMLTextAreaElement>(null);
  const contentsInputRef = useRef<HTMLTextAreaElement>(null);
  return (
    <div className={styles.wrapper}>
      <textarea ref={titleInputRef} className={styles.title}></textarea>
      <textarea ref={contentsInputRef} className={styles['main-contents']}></textarea>
      <button onClick={postUploadHandler}>업로드</button>
    </div>
  );
};

export default NewPostForm;
