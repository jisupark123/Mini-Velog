import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useMutation from '../../lib/client/useMutation';
import useUser from '../../lib/client/useUser';
import { getTags } from '../../lib/client/utils';
import DisplayLength from '../ui/\bdisplay-length';
import InputHelper from '../notification/input-helper';
import Overlay from '../ui/overlay';
import SettingLayout from '../ui/setting-layout';
import BasicModal from './basic-modal';
import styles from './new.module.scss';
import Notice from '../notification/notice';

interface Props {
  closeNewPost: () => void;
}

interface IForm {
  title: string;
  subTitle: string;
  tag: string;
  contents: string;
  image: FileList;
}

export interface INewPost {
  title: string;
  subTitle: string;
  tags: string[];
  contents: string;
  images: string[];
  showLikes: boolean;
  allowComments: boolean;
}

interface MutationResult {
  ok: boolean;
}

const titleLimit = 30;
const subTitleLimit = 150;
const contentsLimit = 2000;
const tagLimit = 10;

const New: React.FC<Props> = ({ closeNewPost }) => {
  const router = useRouter();

  const [page, setPage] = useState(1); // 현재 페이지
  const [showTagInputHelper, setShowTagInputHelper] = useState(false);
  const [tagPreview, setTagPreview] = useState(''); // 태그 미리보기
  const [imagePreview, setImagePreview] = useState('');
  const [showLikes, setShowLikes] = useState(true); // 좋아요, 조회수 숨기기
  const [allowComments, setAllowComments] = useState(true); // 댓글 허용
  const [notice, setNotice] = useState({
    show: false,
    isSuccessed: true,
    contents: '',
  });
  // const imgInputRef = useRef<HTMLInputElement>(null);
  const { register, watch, handleSubmit, formState, setFocus, setValue } =
    useForm<IForm>();

  const { title, subTitle, contents } = watch();
  const image = watch('image');

  const [uploadPost, { loading, data: uploadResponse, error }] =
    useMutation<MutationResult>({ method: 'POST', url: 'api/posts' });

  useEffect(() => {
    console.log('image change');
    if (image && image.length > 0) {
      const file = image[0];
      setImagePreview(URL.createObjectURL(file));
    }
  }, [image]);

  useEffect(() => {
    if (uploadResponse?.ok) {
      // setNotice({
      //   show: true,
      //   isSuccessed: true,
      //   contents: '성공적으로 업로드되었습니다.',
      // });
      closeNewPost();
      router.push('/');
    }
  }, [uploadResponse, closeNewPost, router]);

  function validateForm(data: IForm) {
    function noticeFail(msg: string) {
      setNotice({
        show: true,
        isSuccessed: false,
        contents: msg,
      });
    }
    if (data.title.trim().length === 0) {
      noticeFail('제목이 비어있습니다.');
      return false;
    }
    if (data.title.trim().length > titleLimit) {
      noticeFail(`제목 글자 수 초과 (${titleLimit}자 제한)`);
      return false;
    }
    if (getTags(data.tag).length > tagLimit) {
      noticeFail('태그는 최대 10개까지 입력할 수 있습니다.');
      return false;
    }
    if (data.contents.trim().length > contentsLimit) {
      noticeFail(`본문 글자 수 초과 (${contentsLimit}자 제한)`);
      return false;
    }
    if (data.subTitle.trim().length > subTitleLimit) {
      noticeFail(`부제목 글자 수 초과 (${subTitleLimit}자 제한)`);
      return false;
    }
    return true;
  }

  function postUploadHandler(data: IForm) {
    if (!validateForm(data)) return false;
    const newPost: INewPost = {
      title: data.title,
      subTitle: data.subTitle,
      tags: getTags(data.tag),
      contents: data.contents,
      images: [imagePreview],
      showLikes,
      allowComments,
    };
    uploadPost(newPost);
  }
  function handleOverlayClose() {
    closeNewPost();
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

  function handleDisplayTag(tagInput: string) {
    const tags = getTags(tagInput);
    setTagPreview(tags.map((tag) => `#${tag}`).join(' '));
  }

  function closeNotice() {
    setNotice({ show: false, isSuccessed: true, contents: '' });
  }

  function handleSetPage2() {
    if (!subTitle?.length) {
      setValue('subTitle', contents?.slice(0, subTitleLimit));
    }
    setPage(2);
  }

  return (
    <Overlay onCloseHandler={handleOverlayClose} hasCloseBtn={true}>
      <div className={styles.notice}>
        <Notice
          show={notice.show}
          isSuccessed={notice.isSuccessed}
          contents={notice.contents}
          closeNotice={closeNotice}
        />
      </div>

      <form
        onSubmit={handleSubmit(postUploadHandler)}
        spellCheck={false}
        autoComplete='off'
      >
        {page === 1 && (
          <BasicModal
            header='새 게시물 만들기'
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
                  {...register('tag', {
                    onBlur: () => setShowTagInputHelper(false),
                    onChange: () => handleDisplayTag(watch('tag')),
                  })}
                  placeholder='태그를 달아주세요'
                  onFocus={() => setShowTagInputHelper(true)}
                ></textarea>
                {/* <div className={styles['tag-length']}>
                  <DisplayLength limit={10} value={0} />
                </div> */}
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
                <div className={styles['contents-length']}>
                  <DisplayLength
                    limit={contentsLimit}
                    value={contents?.trim().length || 0}
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

export default New;
