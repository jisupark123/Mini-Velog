import NewPostForm from '../../components/newPost/new-post-form';
import { IPost } from '../../models/Post';
import styles from './upload.module.scss';

const Write = () => {
  async function uploadPostHandler(newPost: IPost) {
    await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    });
  }
  return (
    <div className={styles.container}>
      <NewPostForm onUploadPost={uploadPostHandler} />
    </div>
  );
};

export default Write;
