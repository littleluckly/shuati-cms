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
  type: 'single' | 'multiple' | 'judgment' | 'programming' | 'blank' | 'answer';
  difficulty: 'easy' | 'medium' | 'hard';
  subjectId: string;
  tags: string[];
  question_markdown: string;
  answer_simple_markdown?: string;
  answer_detail_markdown?: string;
  answer_analysis_markdown?: string;
  options?: QuestionOption[];
  files?: QuestionFiles;
  isEnabled?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
  created_at: string;
  updated_at: string;
}

// 科目标签类型
interface SubjectTag {
  name: string;
  value: string;
}

// 科目类型
export interface Subject {
  _id: string;
  name: string;
  code: string;
  description?: string;
  tags?: SubjectTag[];
  userTags?: SubjectTag[];
  difficultyLevels?: string[];
  isEnabled: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 带统计信息的科目类型
export interface SubjectWithStats extends Subject {
  questionCount: number;
  difficultyCount: {
    easy: number;
    medium: number;
    hard: number;
  };
}

// 创建科目参数类型
export interface CreateSubjectParams {
  name: string;
  code: string;
  description?: string;
  tags?: SubjectTag[];
  userTags?: SubjectTag[];
  difficultyLevels?: string[];
  isEnabled?: boolean;
}

// 更新科目参数类型
export interface UpdateSubjectParams {
  name?: string;
  description?: string;
  tags?: SubjectTag[];
  userTags?: SubjectTag[];
  difficultyLevels?: string[];
  isEnabled?: boolean;
}

// 获取科目列表请求参数类型
export interface GetSubjectsParams {
  searchKeyword?: string;
  page?: number;
  limit?: number;
  isEnabled?: boolean;
}

// 科目列表响应类型（带分页）
export interface GetSubjectsResponse {
  subjects: Subject[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
  };
}

// 获取带统计的科目列表响应类型
export interface GetSubjectsWithStatsResponse {
  subjects: SubjectWithStats[];
}
