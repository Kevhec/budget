import axiosClient from '@/config/axios';
import { ApiResponse, Category } from '@/types';

async function getCategories() {
  try {
    const { data } = await axiosClient<ApiResponse<Category[]>>('http://localhost:3000/api/category/');

    const categories = data.data;

    if (categories.length > 0) {
      return categories;
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default getCategories;
