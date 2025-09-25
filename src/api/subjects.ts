import request, { get, post, put, del } from '../utils/request';
import {
  ApiResponse,
  Subject,
  SubjectWithStats,
  CreateSubjectParams,
  UpdateSubjectParams,
  GetSubjectsResponse,
  GetSubjectsWithStatsResponse,
  GetSubjectsParams
} from './types';

// 新增科目
export const createSubject = async (params: CreateSubjectParams): Promise<Subject> => {
  const response = await post<ApiResponse<Subject>>('/subjects', params);
  return response.data;
};

// 修改科目
export const updateSubject = async (id: string, params: UpdateSubjectParams): Promise<Subject> => {
  const response = await put<ApiResponse<Subject>>(`/subjects/${id}`, params);
  return response.data;
};

// 删除科目
export const deleteSubject = async (id: string): Promise<void> => {
  await del<ApiResponse<null>>(`/subjects/${id}`);
};

// 获取所有科目
export const getSubjects = async (params?: GetSubjectsParams): Promise<GetSubjectsResponse> => {
  const response = await get<GetSubjectsResponse>('/subjects', params);
  return { subjects: response.subjects, pagination: response.pagination };
};

// 获取所有科目详细信息（带统计）
export const getAllSubjectsWithStats = async (): Promise<SubjectWithStats[]> => {
  const response = await get<ApiResponse<GetSubjectsWithStatsResponse>>('/subjects/all');
  return response.data.subjects;
};

// 根据ID获取科目详情
export const getSubjectById = async (id: string): Promise<Subject> => {
  const response = await get<Subject>(`/subjects/${id}`);
  return response;
};