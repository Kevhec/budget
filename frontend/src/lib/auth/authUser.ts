import axiosClient from '@/config/axios';
import { AuthResponse } from '@/types';

export default async function authUser(): Promise<AuthResponse> {
  try {
    const response = await axiosClient.get(`${import.meta.env.VITE_API_BASEURL}/user/`);
    return response.data;
  } catch (error: any) {
    return error;
  }
}
