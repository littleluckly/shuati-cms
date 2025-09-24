import { post, del, get } from '../utils/request';
import { GetQuestionsParams, GetQuestionsResponse, Question } from './types';

/**
 * 获取题目列表
 * @param params 筛选参数
 * @returns 题目列表和分页信息
 */
export const getQuestions = async (params: GetQuestionsParams): Promise<GetQuestionsResponse> => {
  return post<GetQuestionsResponse>('/questions/list', params);
};

/**
 * 根据ID获取题目详情
 * @param id 题目ID
 * @returns 题目详情
 */
export const getQuestionById = async (id: string): Promise<Question> => {
  return get<Question>(`/questions/${id}`);
};

/**
 * 删除题目
 * @param id 题目ID
 * @returns 删除结果
 */
export const deleteQuestion = async (id: string): Promise<void> => {
  return del<void>(`/questions/${id}`);
};

/**
 * 创建题目
 * @param question 题目数据
 * @returns 创建的题目
 */
export const createQuestion = async (question: Omit<Question, '_id' | 'created_at' | 'updated_at'>): Promise<Question> => {
  return post<Question>('/questions', question);
};

/**
 * 更新题目
 * @param id 题目ID
 * @param question 题目数据
 * @returns 更新后的题目
 */
export const updateQuestion = async (id: string, question: Partial<Question>): Promise<Question> => {
  return post<Question>(`/questions/${id}`, question);
};

/**
 * 批量删除题目
 * @param ids 题目ID列表
 * @returns 删除结果
 */
export const batchDeleteQuestions = async (ids: string[]): Promise<void> => {
  return post<void>('/questions/batch-delete', { ids });
};