import axiosClient from '@/config/axios';
import { AuthResponse } from '@/types';

export default async function authUser(): Promise<AuthResponse> {
  try {
    const { data } = await axiosClient.get(`${import.meta.env.VITE_API_BASEURL}/user/`);
    console.log(data);
    return data.data;
  } catch (error: any) {
    return error;
  }
}
