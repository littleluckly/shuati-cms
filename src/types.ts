// 用户类型定义
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// 统计数据类型定义
export interface StatData {
  name: string;
  count: number;
}

// 路由参数类型定义
export interface RouteParams {
  id?: string;
  [key: string]: string | undefined;
}

// 从api目录导入API相关的类型
export * from './api/types';