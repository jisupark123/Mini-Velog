import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useMutation from '../../lib/client/useMutation';
import { getImageUrl, getTags } from '../../lib/client/utils';
import DisplayLength from '../ui/\bdisplay-length';
import InputHelper from '../notification/input-helper';
import Overlay from '../ui/overlay';
import BasicModal from './basic-modal';
import styles from './make-post.module.scss';
import { useNotice } from '../../store/notice-context';
import { useConfirm } from '../../store/confirm-context';
import useUser from '../../lib/client/useUser';
import { ImageResponse } from '../../pages/api/image';
import { AiOutlineDelete } from 'react-icons/ai';
import { TbExchange } from 'react-icons/tb';
import Switch from '../btn/switch';
import { PostUploadResponse, UploadPost } from '../../pages/api/posts';
import { postImage } from '@prisma/client';

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
  images?: postImage[];
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
let images: string[] = [];
let imageDeleted = false;

const MakePost: React.FC<Props> = ({ closeNewPost, update, prevPost }) => {
  const router = useRouter();
  const { user } = useUser();
  const { showConfirm } = useConfirm();
  const [page, setPage] = useState(1); // 현재 페이지
  const [showTagInputHelper, setShowTagInputHelper] = useState(false);
  const [tagPreview, setTagPreview] = useState(''); // 태그 미리보기
  const [imagePreview, setImagePreview] = useState('');
  const [showLikes, setShowLikes] = useState(true); // 좋아요, 조회수 숨기기
  const [allowComments, setAllowComments] = useState(true); // 댓글 허용
  const { successed, failed, loading } = useNotice();
  // const imgInputRef = useRef<HTMLInputElement>(null);
  const {
    register,
    watch,
    handleSubmit,
    formState,
    setFocus,
    setValue,
    resetField,
  } = useForm<IForm>();

  const { title, subTitle, contents, tags, image } = watch();

  const [uploadPost, { loading: uploadLoading, data: uploadResponse, error }] =
    useMutation<PostUploadResponse>({
      method: 'POST',
      url: update ? `/api/posts/${router.query.id}` : '/api/posts',
    });

  useEffect(() => {
    console.log('image change');
    if (image?.length) {
      setImagePreview(URL.createObjectURL(image[0]));
    }
  }, [image]);

  useEffect(() => {
    if (uploadResponse?.ok) {
      successed('성공적으로 업로드되었습니다.');
      closeNewPost();
      // router.push('/');
      // router.push(`/users/${user!.id}/posts`);
      router.push(`/posts/${uploadResponse.postId}`);
    }
    if (!uploadResponse?.ok && error) {
      failed(error.toString());
    }
  }, [uploadResponse, closeNewPost, router, user, error]);

  const postInit = useCallback(
    function (post: IPost) {
      if (post.images?.length) {
        setImagePreview(getImageUrl(post.images[0].imageId, 'postImage'));
        images = [post.images[0].imageId];
        console.log('images:', images);
      }
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

  async function postUploadHandler(data: IForm) {
    if (!user) {
      failed('로그인 후에 이용바랍니다.');
      return;
    }
    if (!validateForm(data)) return;

    loading('업로드 중입니다..');
    if (image?.length) {
      console.log('이미지 있음');
      const { uploadURL }: ImageResponse = await fetch('/api/image').then(
        (res) => res.json()
      );
      const form = new FormData(); // 이미지 파일을 담을 인터페이스
      form.append('file', image[0], user.id + '');
      const {
        result: { id },
      } = await fetch(uploadURL, {
        method: 'POST',
        body: form,
      }).then((res) => res.json());
      images = [id]; // 여러 이미지 업로드 할 땐 images.push(id)로 바꿔야 함
    }

    const newPost: UploadPost = {
      title: data.title,
      subTitle: data.subTitle,
      tags: getTags(data.tags),
      contents: data.contents,
      images,
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

  function handleSetPage3() {
    if (!subTitle?.length) {
      setValue('subTitle', contents?.slice(0, subTitleLimit));
    }
    setPage(3);
  }

  function deleteImage(event: FormEvent<HTMLButtonElement>) {
    event.preventDefault();
    resetField('image');
    setImagePreview('');
    imageDeleted = true;
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
            rightBtn={{ title: '다음', onClickHandler: () => setPage(2) }}
          >
            <div className={styles.container1}>
              {imagePreview ? (
                <div className={styles['image-preview']}>
                  <Image
                    src={imagePreview}
                    // width={1080}
                    // height={500}
                    layout='fill'
                    alt='이미지 미리보기'
                    objectFit='cover'
                    priority={true}
                  />
                  <div className={styles.btns}>
                    <button onClick={deleteImage}>
                      <AiOutlineDelete />
                    </button>
                    <label htmlFor='image'>
                      <TbExchange />
                    </label>
                  </div>
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
                    <h2>사진을 추가하세요</h2>
                  </div>
                  <div className={styles['image-input']}>
                    <label htmlFor='image' className={styles['image-btn']}>
                      파일에서 선택
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
          </BasicModal>
        )}
        {page === 2 && (
          <BasicModal
            header={update ? '게시물 수정하기' : '새 게시물 만들기'}
            backBtn={{ onClickHandler: () => setPage(1) }}
            rightBtn={{ title: '다음', onClickHandler: handleSetPage3 }}
          >
            <div className={styles.container2}>
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
        {page === 3 && (
          <BasicModal
            header={update ? '게시물 수정하기' : '새 게시물 만들기'}
            backBtn={{ onClickHandler: goToPreviousPage }}
            rightBtn={{
              title: update ? '완료' : '공유하기',
              onClickHandler: () => handleSubmit(postUploadHandler),
            }}
          >
            <div className={styles.container3}>
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
                  <div className={styles.ment}>
                    <div className={styles.title}>
                      이 게시물의 좋아요 수 및 조회수 숨기기
                    </div>
                    <div className={styles.description}>
                      <p>
                        이 게시물의 총 좋아요 및 조회수를 다른 사람이 볼 수
                        없습니다. 나중에 설정에서 변경할 수 있습니다.
                      </p>
                    </div>
                  </div>
                  <div className={styles.switch}>
                    <Switch handleClick={toggleShowLikes} state={showLikes} />
                  </div>
                </div>
                <div className={styles.setting}>
                  <div className={styles.ment}>
                    <div className={styles.title}>댓글 기능 해제</div>
                    <div className={styles.description}>
                      <p>나중에 설정에서 변경할 수 있습니다.</p>
                    </div>
                  </div>
                  <div className={styles.switch}>
                    <Switch
                      handleClick={toggleAllowComments}
                      state={allowComments}
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
