import styles from './post-card.module.scss';

interface PostCardProps {
  title: string;
  subTitle: string;
  nickName: string;
  // createdAt: Date;
  likes: number;
  commentCount: number;
}
const PostCard: React.FC<PostCardProps> = (props) => {
  return <div className={styles.container}></div>;
};

export default PostCard;
