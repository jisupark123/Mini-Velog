import TitleInput from './tiltle-input';
import styles from './new-post-form.module.module.scss';
import React, { useRef } from 'react';
import { IPost } from '../../models/Post';

interface INewPostFormProps {
  onUploadPost: (newPost: IPost) => void;
}

const NewPostForm: React.FC<INewPostFormProps> = (props) => {
  const titleInputRef = useRef<HTMLTextAreaElement>(null);
  const contentsInputRef = useRef<HTMLTextAreaElement>(null);

  function submitHandler() {
    const title = titleInputRef.current!.value;
    const contents = contentsInputRef.current!.value;
    // validate
    const newPost: IPost = {
      title,
      contents,
    };
    props.onUploadPost(newPost);
  }

  return (
    <div className={styles.wrapper}>
      <textarea ref={titleInputRef} className={styles.title}></textarea>
      <textarea ref={contentsInputRef} className={styles['main-contents']}></textarea>
      <button onClick={submitHandler}>업로드</button>
    </div>
  );
};

export default NewPostForm;
