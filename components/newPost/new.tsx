import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import DisplayLength from '../ui/\bdisplay-length';
import Overlay from '../ui/overlay';
import SettingLayout from '../ui/setting-layout';
import BasicModal from './basic-modal';
import styles from './new.module.scss';

interface Props {
  closeNewPost: () => void;
}

interface IFrom {
  title: string;
  tag: string;
  contents: string;
  photo: FileList;
  subTitle: string;
}

const titleLimit = 30;
const subTitleLimit = 100;
const contentsLimit = 2000;

const New: React.FC<Props> = ({ closeNewPost }) => {
  const [page, setPage] = useState(1); // 현재 페이지
  const [showLikes, setShowLikes] = useState(true); // 좋아요, 조회수 숨기기
  const [allowComments, setAllowComments] = useState(true); // 댓글 허용
  // const imgInputRef = useRef<HTMLInputElement>(null);
  const { register, watch, handleSubmit, formState, setFocus, setValue } =
    useForm<IFrom>();
  const { title, subTitle, contents } = watch();
  function onValid(data: IFrom) {
    if (data.title.trim().length === 0) {
      alert('제목이 비어있습니다.');
      setPage(1);
    }
  }
  function postUploadHandler(data: IFrom) {
    console.log(data);
  }
  function onCloseHandler() {
    closeNewPost();
  }
  function finishPage1() {
    setPage(2);
  }
  function goToPreviousPage() {
    setPage((prev) => prev - 1);
  }
  function toggleShowLikes() {
    setShowLikes((prev) => !prev);
  }
  function toggleAllowComments() {
    setAllowComments((prev) => !prev);
  }
  function appendTag(event: React.FormEvent<HTMLButtonElement>) {
    event.preventDefault();
    const text = watch().tag.trim();
    if (text.slice(-1) !== '#') {
      setValue('tag', `${text}${text.length > 0 ? ' ' : ''}#`);
    }
    setFocus('tag');
  }

  const photo = watch('photo');
  const [photoPreview, setPhotoPreview] = useState('');

  useEffect(() => {
    console.log('image change');
    if (photo && photo.length > 0) {
      const file = photo[0];
      setPhotoPreview(URL.createObjectURL(file));
    }
  }, [photo]);

  return (
    <Overlay onCloseHandler={onCloseHandler}>
      <form onSubmit={handleSubmit(postUploadHandler)} spellCheck={false}>
        {page === 1 && (
          <BasicModal
            header='새 게시물 만들기'
            rightBtn={{ title: '다음', onClickHandler: finishPage1 }}
          >
            <div className={styles.container1}>
              <div className={styles.title}>
                <textarea
                  {...register('title')}
                  placeholder='제목을 입력하세요'
                ></textarea>
                <div className={styles['title-length']}>
                  <DisplayLength
                    limit={titleLimit}
                    value={title?.length || 0}
                  />
                </div>
                <div className={styles.line}></div>
              </div>
              <div className={styles.tag}>
                <textarea
                  {...register('tag')}
                  placeholder='태그를 달아주세요'
                ></textarea>
                <div className={styles['tag-btn']}>
                  <button onClick={appendTag}>#</button>
                </div>
              </div>
              <div className={styles.contents}>
                <textarea
                  {...register('contents')}
                  placeholder='멘트 작성...'
                ></textarea>
                <div className={styles['contents-length']}>
                  <DisplayLength
                    limit={contentsLimit}
                    value={contents?.length || 0}
                  />
                </div>
              </div>
            </div>
          </BasicModal>
        )}
        {page === 2 && (
          <BasicModal
            wide={true}
            header='새 게시물 만들기'
            backBtn={{ onClickHandler: goToPreviousPage }}
            rightBtn={{
              title: '공유하기',
              onClickHandler: () => handleSubmit(postUploadHandler),
            }}
          >
            <div className={styles.container2}>
              <div className={styles.photo}>
                {photoPreview ? (
                  <div className={styles['photo-preview']}>
                    <Image
                      src={photoPreview}
                      // width={1080}
                      // height={500}
                      layout='fill'
                      alt='이미지 미리보기'
                    />
                    <label htmlFor='photo' className={styles['photo-change']}>
                      변경
                    </label>
                    <input
                      {...register('photo')}
                      // ref={imgInputRef}
                      type='file'
                      accept='image/*'
                      id='photo'
                      className={styles.hidden}
                    />
                  </div>
                ) : (
                  <div className={styles['photo-inputs']}>
                    <div className={styles['photo-icon']}></div>
                    <div className={styles['photo-ment']}>
                      <h2>첨부할 사진을 여기에 끌어다 놓으세요</h2>
                    </div>
                    <div className={styles['photo-input']}>
                      <label htmlFor='photo'>
                        <div className={styles['photo-btn']}>
                          컴퓨터에서 선택
                        </div>
                      </label>
                      <input
                        {...register('photo')}
                        // ref={imgInputRef}
                        type='file'
                        accept='image/*'
                        id='photo'
                        className={styles.hidden}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className={styles.main}>
                <div className={styles['sub-title']}>
                  <textarea
                    {...register('subTitle')}
                    placeholder='당신의 포스트를 짧게 소개해보세요.'
                  ></textarea>
                  <div className={styles['sub-title-bottom']}>
                    <div className={styles['text-length']}>
                      <DisplayLength
                        limit={subTitleLimit}
                        value={subTitle?.length || 0}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.settings}>
                  <div className={styles.setting}>
                    <SettingLayout
                      title='이 게시물의 좋아요 수 및 조회수 숨기기'
                      description='이 게시물의 총 좋아요 및 조회수를 다른 사람이 볼 수 없습니다. 나중에 설정에서 변경할 수 있습니다.'
                      state={showLikes}
                      handleClick={toggleShowLikes}
                    />
                  </div>
                  <div className={styles.setting}>
                    <SettingLayout
                      title='댓글 기능 해제'
                      description='나중에 설정에서 변경할 수 있습니다.'
                      state={allowComments}
                      handleClick={toggleAllowComments}
                    />
                  </div>
                </div>
              </div>
            </div>
          </BasicModal>
        )}
      </form>
    </Overlay>
  );
};

export default New;
