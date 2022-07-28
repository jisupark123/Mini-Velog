import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useMutation from '../../lib/client/useMutation';
import { getTags } from '../../lib/client/utils';
import DisplayLength from '../ui/\bdisplay-length';
import InputHelper from '../notification/input-helper';
import Overlay from '../ui/overlay';
import SettingLayout from '../layouts/setting-layout';
import BasicModal from './basic-modal';
import styles from './make-post.module.scss';
import { useNotice } from '../../store/notice-context';
import { useConfirm } from '../../store/confirm-context';

interface Props {
  update: boolean;
  prevPost?: IPost;
  closeNewPost: () => void;
}

interface IForm {
  title: string;
  subTitle: string;
  tags: string;
  contents: string;
  image: FileList;
}

export interface IPost {
  title: string;
  subTitle: string;
  tags: string[];
  contents: string;
  images?: string[];
  showLikes: boolean;
  allowComments: boolean;
}

interface MutationResult {
  ok: boolean;
}

const titleLimit = 30;
const subTitleLimit = 150;
const contentsLimit = 10000;
const tagLimit = 10;

const MakePost: React.FC<Props> = ({ closeNewPost, update, prevPost }) => {
  const router = useRouter();
  const { showConfirm } = useConfirm();
  const [page, setPage] = useState(1); // 현재 페이지
  const [showTagInputHelper, setShowTagInputHelper] = useState(false);
  const [tagPreview, setTagPreview] = useState(''); // 태그 미리보기
  const [imagePreview, setImagePreview] = useState('');
  const [showLikes, setShowLikes] = useState(true); // 좋아요, 조회수 숨기기
  const [allowComments, setAllowComments] = useState(true); // 댓글 허용
  const { successed, failed } = useNotice();
  // const imgInputRef = useRef<HTMLInputElement>(null);
  const { register, watch, handleSubmit, formState, setFocus, setValue } =
    useForm<IForm>();

  const { title, subTitle, contents, tags, image } = watch();

  const [uploadPost, { loading, data: uploadResponse, error }] =
    useMutation<MutationResult>({
      method: 'POST',
      url: update ? `/api/posts/${router.query.id}` : '/api/posts',
    });

  useEffect(() => {
    console.log('image change');
    if (image && image.length > 0) {
      const file = image[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [image]);

  useEffect(() => {
    if (uploadResponse?.ok) {
      successed('성공적으로 업로드되었습니다.');
      closeNewPost();
      router.push('/');
    }
  }, [uploadResponse, closeNewPost, router, successed]);

  const postInit = useCallback(
    function (post: IPost) {
      const tags = post.tags.join(',');
      setValue('title', post.title);
      setValue('tags', tags);
      setValue('contents', post.contents);
      setValue('subTitle', post.subTitle);
      setShowLikes(post.showLikes);
      setAllowComments(post.allowComments);
      // setValue('image', post.images); 나중에 이미지도 넣어줘야 함
    },
    [setValue]
  );

  useEffect(() => {
    if (update && prevPost) {
      postInit(prevPost);
    }
  }, [postInit, prevPost, update]);

  function validateForm(data: IForm) {
    if (data.title.trim().length === 0) {
      failed('제목이 비어있습니다.');
      return false;
    }
    if (data.title.trim().length > titleLimit) {
      failed(`제목 글자 수 초과 (${titleLimit}자 제한)`);
      return false;
    }
    if (getTags(data.tags).length > tagLimit) {
      failed(`태그는 최대 ${tagLimit}개까지 입력할 수 있습니다.`);
      return false;
    }
    if (data.contents.trim().length > contentsLimit) {
      failed(`본문 글자 수 초과 (${contentsLimit}자 제한)`);
      return false;
    }
    if (data.subTitle.trim().length > subTitleLimit) {
      failed(`부제목 글자 수 초과 (${subTitleLimit}자 제한)`);
      return false;
    }
    return true;
  }

  function postUploadHandler(data: IForm) {
    if (!validateForm(data)) return false;
    const formData = new FormData(); // 이미지 파일을 담을 인터페이스
    formData.append('file', image[0]);
    const newPost: IPost = {
      title: data.title,
      subTitle: data.subTitle,
      tags: getTags(data.tags),
      contents: data.contents,
      showLikes,
      allowComments,
    };
    uploadPost(newPost);
  }
  function handleOverlayClose() {
    if (
      title?.length ||
      subTitle?.length ||
      contents?.length ||
      tags?.length ||
      image?.length
    ) {
      showConfirm({
        message: '지금 나가면 변경사항이 저장되지 않습니다.',
        handleOk: closeNewPost,
      });
    } else {
      closeNewPost();
    }
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
    const text = watch().tags.trim();
    if (text.slice(-1) !== '#') {
      setValue('tags', `${text}${text.length > 0 ? ' ' : ''}#`);
    }
    setFocus('tags');
  }

  function handleDisplayTag(tagInput: string) {
    const tags = getTags(tagInput);
    setTagPreview(tags.map((tag) => `#${tag}`).join(' '));
  }

  function handleSetPage2() {
    if (!subTitle?.length) {
      setValue('subTitle', contents?.slice(0, subTitleLimit));
    }
    setPage(2);
  }

  return (
    <Overlay onCloseHandler={handleOverlayClose} hasCloseBtn={true}>
      <form
        onSubmit={handleSubmit(postUploadHandler)}
        spellCheck={false}
        autoComplete='off'
      >
        {page === 1 && (
          <BasicModal
            header={update ? '게시물 수정하기' : '새 게시물 만들기'}
            rightBtn={{ title: '다음', onClickHandler: handleSetPage2 }}
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
                    value={title?.trim().length || 0}
                  />
                </div>
                <div className={styles.line}></div>
              </div>
              <div className={styles.tag}>
                <textarea
                  {...register('tags', {
                    onBlur: () => setShowTagInputHelper(false),
                    onChange: () => handleDisplayTag(watch('tags')),
                  })}
                  placeholder='태그를 달아주세요'
                  onFocus={() => setShowTagInputHelper(true)}
                ></textarea>
                <div className={styles['tag-length']}>
                  <DisplayLength
                    limit={tagLimit}
                    value={getTags(tags).length || 0}
                  />
                </div>
                <InputHelper
                  show={showTagInputHelper}
                  advice={
                    '태그와 태그는 쉼표로 구분하며 10개까지 입력하실 수 있습니다.'
                    // <>
                    //   <span></span>
                    //   <br />
                    //   <span></span>
                    // </>
                  }
                  display={tagPreview}
                />
              </div>
              <div className={styles.contents}>
                <textarea
                  {...register('contents')}
                  placeholder='멘트 작성...'
                ></textarea>
              </div>
            </div>
          </BasicModal>
        )}
        {page === 2 && (
          <BasicModal
            wide={true}
            header={update ? '게시물 수정하기' : '새 게시물 만들기'}
            backBtn={{ onClickHandler: goToPreviousPage }}
            rightBtn={{
              title: update ? '완료' : '공유하기',
              onClickHandler: () => handleSubmit(postUploadHandler),
            }}
          >
            <div className={styles.container2}>
              <div className={styles.image}>
                {imagePreview ? (
                  <div className={styles['image-preview']}>
                    <Image
                      src={imagePreview}
                      // width={1080}
                      // height={500}
                      layout='fill'
                      alt='이미지 미리보기'
                    />
                    <label htmlFor='image' className={styles['image-change']}>
                      변경
                    </label>
                    <input
                      {...register('image')}
                      // ref={imgInputRef}
                      type='file'
                      accept='image/*'
                      id='image'
                      className={styles.hidden}
                    />
                  </div>
                ) : (
                  <div className={styles['image-inputs']}>
                    <div className={styles['image-icon']}></div>
                    <div className={styles['image-ment']}>
                      <h2>첨부할 사진을 여기에 끌어다 놓으세요</h2>
                    </div>
                    <div className={styles['image-input']}>
                      <label htmlFor='image'>
                        <div className={styles['image-btn']}>
                          컴퓨터에서 선택
                        </div>
                      </label>
                      <input
                        {...register('image')}
                        // ref={imgInputRef}
                        type='file'
                        accept='image/*'
                        id='image'
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
                        value={subTitle?.trim().length || 0}
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

export default MakePost;
