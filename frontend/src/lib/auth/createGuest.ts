import axiosClient from '@/config/axios';
import { AuthResponse } from '@/types';

interface Params {
  username: string
}

async function createGuest({ username }: Params): Promise<AuthResponse> {
  try {
    const { data } = await axiosClient.post('/user/guest', {
      username,
    });

    console.log(data);

    return data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
}

export default createGuest;
