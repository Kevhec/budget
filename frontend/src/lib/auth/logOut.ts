import axiosClient from '@/config/axios';
import { MessageResponse } from '@/types';

export default async function logOut(): Promise<MessageResponse> {
  const url = `${import.meta.env.VITE_API_BASEURL}/user/logout`;
  try {
    const { data } = await axiosClient.post(url);
    return data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
}
