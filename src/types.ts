// 选项类型定义
export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

// 题目类型定义
export interface Question {
  id: string;
  title: string;
  type: string;
  difficulty: string;
  category: string;
  content?: string;
  options?: QuestionOption[];
  answer?: string | string[];
  explanation?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

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