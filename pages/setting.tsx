import { User } from '@prisma/client';
import { GetStaticProps, NextPage } from 'next';
import Image from 'next/image';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../components/layouts/layout';
import LoadingSvg from '../components/svg/loading-svg';
import useMutation from '../lib/client/useMutation';
import useUser from '../lib/client/useUser';
import { defaultAvatar, getImageUrl } from '../lib/client/utils';
import { ResponseType } from '../lib/server/withHandler';
import { useNotice } from '../store/notice-context';
import { ImageResponse } from './api/image';
import styles from './setting.module.scss';

interface SettingForm {
  avatar: FileList;
  nickname: string;
  introduction: string;
}

let avatarDeleted = false;

const Setting: NextPage = () => {
  const { user, mutate: refreshUser } = useUser();
  const { successed, failed } = useNotice();
  const {
    register,
    watch,
    setValue,
    setError,
    handleSubmit,
    resetField,
    formState: { errors: formError },
  } = useForm<SettingForm>();
  const [avatarPreview, setAvatarPreview] = useState('');
  const [nicknameIsValid, setNicknameIsValid] = useState<
    boolean | 'loading' | null
  >(null);
  const [editProfile, { data, loading }] = useMutation<ResponseType>({
    method: 'POST',
    url: '/api/users/me',
  });
  const { avatar, nickname } = watch();
  const formInit = useCallback(
    function () {
      setValue('nickname', user!.nickname);
      setValue('introduction', user!.introduction);
      if (user?.avatar) {
        setAvatarPreview(getImageUrl(user!.avatar, 'avatar'));
      }
    },
    [setValue, user]
  );

  const nicknameCheck = useCallback(
    function (nickname: string) {
      if (nickname.trim().length > 20) {
        setError(
          'nickname',
          {
            type: 'maxLength',
            message: '제한 길이 초과입니다. (20자 제한)',
          },
          { shouldFocus: true }
        );
        return false;
      }
      return true;
    },
    [setError]
  );

  function deleteAvatar(event: FormEvent<HTMLButtonElement>) {
    event.preventDefault();
    resetField('avatar');
    setAvatarPreview('');
    avatarDeleted = true;
  }

  async function onValid({ avatar, nickname, introduction }: SettingForm) {
    if (loading) return;
    if (introduction.trim().length > 50) {
      setError(
        'introduction',
        {
          type: 'maxLength',
          message: '제한 길이 초과입니다. (50자 제한)',
        },
        { shouldFocus: true }
      );
      return;
    }
    if (!nicknameCheck(nickname)) return;

    // 이미지가 있다면
    if (avatar?.length && user) {
      // 1. 업로드 url 받아오기
      const { uploadURL }: ImageResponse = await fetch('/api/image').then(
        (res) => res.json()
      );
      const form = new FormData();
      form.append('file', avatar[0], user.id + '');

      // 2. 이미지 업로드하기
      const {
        result: { id: avatarId },
      } = await fetch(uploadURL, {
        method: 'POST',
        body: form,
      }).then((res) => res.json());
      editProfile({
        avatarId,
        introduction,
        nickname,
      });
      // 이미지가 삭제되었다면
    } else if (avatarDeleted) {
      editProfile({
        avatarId: '',
        introduction,
        nickname,
      });
    } else {
      editProfile({
        introduction,
        nickname,
      });
    }
  }

  useEffect(() => {
    if (!data?.ok && data?.error) {
      failed(data.error);
      return;
    }
    if (data?.ok) {
      successed('변경되었습니다.');
      refreshUser();

      return;
    }
  }, [data, refreshUser]);

  useEffect(() => {
    if (user) {
      formInit();
    }
  }, [formInit, user]);
  useEffect(() => {
    console.log('avatar change', avatar);
    if (avatar?.length) {
      setAvatarPreview(URL.createObjectURL(avatar[0]));
      avatarDeleted = false;
    }
  }, [avatar, setValue]);

  useEffect(() => {
    if (nickname == user?.nickname || !nickname?.length) {
      setNicknameIsValid(null);
      return;
    }

    setNicknameIsValid('loading');
    const checkValid = setTimeout(() => {
      const valid = nicknameCheck(nickname);
      if (valid) {
        setNicknameIsValid(true);
      } else {
        setNicknameIsValid(false);
      }
    }, 1000);
    return () => {
      clearTimeout(checkValid);
    };
  }, [nickname, nicknameCheck, setNicknameIsValid, user]);

  return (
    <Layout>
      <div className={styles.container}>
        <form
          onSubmit={handleSubmit(onValid)}
          className={styles.form}
          spellCheck='false'
          autoComplete='off'
        >
          <h1 className={styles.title}>설정</h1>
          <section className={styles['section-row']}>
            <h1>프로필 사진</h1>
            <div className={styles['image-settings']}>
              <div className={styles['user-icon']}>
                <Image
                  src={avatarPreview || defaultAvatar}
                  layout='fill'
                  alt=''
                  priority={true}
                  // objectFit='cover'
                />
              </div>
              <input
                {...register('avatar')}
                type='file'
                accept='image/*'
                id='avatar'
                className={styles.hidden}
              />
              <div className={styles.btns}>
                <label htmlFor='avatar'>이미지 업로드</label>
                <button onClick={deleteAvatar}>기본 이미지로 변경</button>
              </div>
            </div>
          </section>
          <section className={styles['section-row']}>
            <h1>소개</h1>
            <div className={styles['intro-setting']}>
              <input
                {...register('introduction')}
                type='text'
                placeholder='자신을 소개할 한마디를 적어주세요.'
              />
              <span>{formError.introduction?.message || ''}</span>
            </div>
          </section>
          <section className={styles['section-row']}>
            <h1>닉네임</h1>
            <div className={styles['nickname-setting']}>
              <input
                {...register('nickname')}
                type='text'
                placeholder='사용할 닉네임을 설정해주세요.'
              />
              <div className={styles['valid-check']}>
                {nicknameIsValid === 'loading' && (
                  <LoadingSvg width={30} speed='normal' thickness='slim' />
                )}
                <span
                  className={`${
                    nicknameIsValid ? styles.valid : styles['not-valid']
                  }`}
                >
                  {nicknameIsValid === true
                    ? '사용할 수 있는 닉네임입니다.'
                    : nicknameIsValid === false
                    ? formError.nickname?.message
                    : ''}
                </span>
              </div>
            </div>
          </section>

          <section className={styles['submit']}>
            <button>저장</button>
          </section>
        </form>
      </div>
    </Layout>
  );
};

export default Setting;
