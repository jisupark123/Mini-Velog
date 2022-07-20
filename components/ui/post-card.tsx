import Link from 'next/link';
import { getDateDiff } from '../../lib/client/utils';
import styles from './post-card.module.scss';

interface PostCardProps {
  id: number;
  title: string;
  subTitle: string;
  name: string;
  createdAt: Date;
  likes: number;
  commentCount: number;
}
const PostCard: React.FC<PostCardProps> = (props) => {
  const timeDiff = getDateDiff(new Date(), new Date(props.createdAt));
  const subTitleLength = props.subTitle.length;
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <Link href={`/posts/${props.id}`}>
          <a className={styles.contents}>
            <h4>{props.title}</h4>
            <div className={styles['sub-title-wrapper']}>
              <p>
                {props.subTitle}
                {subTitleLength === 150 &&
                !['.', '?', '!'].includes(props.subTitle[subTitleLength - 1])
                  ? '...'
                  : ''}
              </p>
            </div>
          </a>
        </Link>
        <div className={styles['sub-info']}>
          <span>{`${timeDiff} 전`}</span>
          <span>&#183;</span>
          <span>{`댓글 ${props.commentCount}개`}</span>
        </div>
      </div>
      <div className={styles.footer}>
        <Link href={'#'}>
          <a className={styles['user-info']}>
            <span>{props.name}</span>
          </a>
        </Link>
        <div className={styles.likes}>
          <svg width='24' height='24' viewBox='0 0 24 24'>
            <path
              fill='currentColor'
              d='M18 1l-6 4-6-4-6 5v7l12 10 12-10v-7z'
            ></path>
          </svg>
          {/* <svg
            aria-label='좋아요'
            color='#262626'
            fill='#262626'
            height='24'
            role='img'
            viewBox='0 0 24 24'
            width='24'
          >
            <path d='M16.792 3.904A4.989 4.989 0 0121.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 014.708-5.218 4.21 4.21 0 013.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 013.679-1.938m0-2a6.04 6.04 0 00-4.797 2.127 6.052 6.052 0 00-4.787-2.127A6.985 6.985 0 00.5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 003.518 3.018 2 2 0 002.174 0 45.263 45.263 0 003.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 00-6.708-7.218z'></path>
          </svg> */}
          {props.likes}
        </div>
      </div>
    </div>
  );
};

export default PostCard;
