import Image from 'next/image';
import Link from 'next/link';
import {
  defaultAvatar,
  getDateDiff,
  getImageUrl,
} from '../../lib/client/utils';
import styles from './post-card.module.scss';

interface PostCardProps {
  id: number;
  title: string;
  subTitle: string;
  nickname: string;
  createdAt: Date;
  likes: number;
  commentCount: number;
  userId: number;
  avatar: string;
}
const PostCard: React.FC<PostCardProps> = (props) => {
  const timeDiff = getDateDiff(new Date(), new Date(props.createdAt));
  const subTitleLength = props.subTitle.length;
  return (
    <div className={styles.container}>
      <Link href={`/posts/${props.id}`}>
        <a className={styles.main}>
          <div className={styles.contents}>
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
          </div>
          <div className={styles['sub-info']}>
            <span>{`${timeDiff} 전`}</span>
            <span>&#183;</span>
            <span>{`댓글 ${props.commentCount}개`}</span>
          </div>
        </a>
      </Link>
      <div className={styles.footer}>
        <Link href={`/users/${props.userId}`}>
          <a className={styles['user-info']}>
            <div className={styles.icon}>
              <Image
                src={
                  props.avatar
                    ? getImageUrl(props.avatar, 'avatar')
                    : defaultAvatar
                }
                alt='user-icon'
                objectFit='cover'
                priority={false}
                layout='fill'
              />
            </div>
            <span>by</span>
            <span>{props.nickname}</span>
          </a>
        </Link>
        {/* <div className={styles.likes}>
          <svg width='24' height='24' viewBox='0 0 24 24'>
            <path
              fill='currentColor'
              d='M18 1l-6 4-6-4-6 5v7l12 10 12-10v-7z'
            ></path>
          </svg>

          {props.likes}
        </div> */}
      </div>
    </div>
  );
};

export default PostCard;
