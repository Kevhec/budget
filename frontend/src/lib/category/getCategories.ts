import axiosClient from '@/config/axios';
import { ApiResponse, Category } from '@/types';

async function getCategories() {
  try {
    const { data } = await axiosClient.get<ApiResponse<Category[]>>('/category/');
    console.log({ data });

    const categories = data.data;

    if (categories.length > 0) {
      return categories;
    }
    return null;
  } catch (error: any) {
    console.log('CATEGORY ERROR: ', error);
    throw new Error(error);
  }
}

export default getCategories;
