// API基础响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}

// 题目列表请求参数类型
export interface GetQuestionsParams {
  subjectId?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  tags?: string[];
  searchKeyword?: string;
  page?: number;
  limit?: number;
}

// 题目列表响应类型
export interface GetQuestionsResponse {
  questions: Question[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

// 题目选项类型
export interface QuestionOption {
  id: string;
  content: string;
  isCorrect: boolean;
}

// 题目文件类型
export interface QuestionFiles {
  audio?: string;
  metadata?: string;
}

// 题目类型
export interface Question {
  _id: string;
  type: 'single' | 'multiple' | 'judgment' | 'programming' | 'blank' | 'essay';
  difficulty: 'easy' | 'medium' | 'hard';
  subjectId: string;
  tags: string[];
  question_markdown: string;
  answer_simple_markdown?: string;
  answer_detail_markdown?: string;
  options?: QuestionOption[];
  files?: QuestionFiles;
  created_at: string;
  updated_at: string;
}