import type {ApiResponse} from '@/types';
import axios from 'axios';
// @ts-ignore
import * as qs from 'qs';

const Axios = axios.create({
    baseURL: 'https://livellu-api.webqube.de/api/',
    timeout: 5000000,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Change request data/error here
Axios.interceptors.request.use((config) => {
    const token = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;
    //@ts-ignore
    config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token ? token : ''}`,
    };
    return config;
});

// Change response data/error here
// Axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (
//       (error.response && error.response.status === 401) ||
//       (error.response && error.response.status === 403) ||
//       (error.response &&
//         error.response.data.message === 'PICKBAZAR_ERROR.NOT_AUTHORIZED')
//     ) {
//       Cookies.remove(AUTH_TOKEN_KEY);
//       Router.replace(Routes.home);
//     }
//     return Promise.reject(error);
//   }
// );

export class HttpClient {
    static async get<T>(collection: string, params: Record<string, any> = {}): Promise<ApiResponse<T> | any> {
        // Convert params object to URL search parameters
        const queryString = qs.stringify(params, {
            encodeValuesOnly: true, // prettify URL
        });
        try {
            console.log('URL: ', `${collection}?${queryString}`);
            const response = await Axios.get<ApiResponse<T>>(`${collection}?${queryString}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error(error.message)
                // throw new Error(error.message);
            } else {
                throw new Error('An unknown error occurred');
            }
        }
    }

    static async post<T>(url: string, data: unknown, options?: any) {
        const response = await Axios.post<T>(url, data, options);
        return response.data;
    }

    static async put<T>(url: string, data: unknown) {
        const response = await Axios.put<T>(url, data);
        return response.data;
    }

    static async delete<T>(url: string) {
        const response = await Axios.delete<T>(url);
        return response.data;
    }


}
