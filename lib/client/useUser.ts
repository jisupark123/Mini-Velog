import { User } from '@prisma/client';
import useSWR from 'swr';

interface ProfileResponse {
  ok: boolean;
  profile: User;
}
interface ResponseType {
  ok: boolean;
  profile: User;
  error?: any;
}

export default function useUser() {
  const { data, error, mutate } = useSWR<ProfileResponse>(
    typeof window === 'undefined' ? null : '/api/users/me'
  );
  // async function getUser() {
  //   const response:ResponseType = await fetch('api/users/me').then((res) => res.json());
  //   return response;
  // }
  // const data = await getUser();
  return { user: data?.profile, isLoading: !data && !error, mutate };
}
