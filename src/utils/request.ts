import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { message } from 'antd';

// 为Vite环境变量添加类型声明
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

// 创建axios实例
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 响应数据类型定义
interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做些什么，比如添加token
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response;
    // 根据统一响应格式处理数据
    if (data.success) {
      return data.data;
    } else {
      // 请求成功但业务失败
      message.error(data.message || '请求失败');
      return Promise.reject(new Error(data.message || '请求失败'));
    }
  },
  (error) => {
    // 处理HTTP错误
    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          message.error(data.message || '请求参数错误');
          break;
        case 401:
          message.error('未授权，请重新登录');
          // 清除token并跳转到登录页
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          message.error('权限不足，无法访问');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        default:
          message.error(data.message || '请求失败');
      }
    } else if (error.request) {
      // 请求发出但没有收到响应
      message.error('网络错误，请检查网络连接');
    } else {
      // 请求配置出错
      message.error('请求配置错误');
    }
    return Promise.reject(error);
  }
);

// 封装get请求
export const get = async <T = any>(url: string, params?: any, config?: InternalAxiosRequestConfig): Promise<T> => {
  const response = await request.get(url, { params, ...config });
  return response as unknown as T;
};

// 封装post请求
export const post = async <T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> => {
  const response = await request.post(url, data, config);
  return response as unknown as T;
};

// 封装put请求
export const put = async <T = any>(url: string, data?: any, config?: InternalAxiosRequestConfig): Promise<T> => {
  const response = await request.put(url, data, config);
  return response as unknown as T;
};

// 封装delete请求
export const del = async <T = any>(url: string, params?: any, config?: InternalAxiosRequestConfig): Promise<T> => {
  const response = await request.delete(url, { params, ...config });
  return response as unknown as T;
};

export default request;