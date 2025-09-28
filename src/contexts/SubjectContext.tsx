import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubjectById,
} from "../api/subjects";
import {
  Subject,
  CreateSubjectParams,
  UpdateSubjectParams,
  GetSubjectsParams,
} from "../api/types";
import { message } from "antd";

interface SubjectContextType {
  subjects: Subject[];
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  searchKeyword: string;
  fetchSubjects: (params?: GetSubjectsParams) => Promise<void>;
  searchSubjects: (keyword: string) => Promise<void>;
  addSubject: (params: CreateSubjectParams) => Promise<Subject>;
  editSubject: (id: string, params: UpdateSubjectParams) => Promise<Subject>;
  removeSubject: (id: string) => Promise<void>;
  getSubjectDetail: (id: string) => Promise<Subject>;
}

const SubjectContext = createContext<SubjectContextType | undefined>(undefined);

interface SubjectProviderProps {
  children: ReactNode;
}

export const SubjectProvider: React.FC<SubjectProviderProps> = ({
  children,
}) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // 获取科目列表（支持搜索和分页）
  const fetchSubjects = useCallback(
    async (params?: GetSubjectsParams) => {
      setLoading(true);
      try {
        const result = await getSubjects({
          ...params,
          page: params?.page ?? currentPage,
          limit: params?.limit ?? pageSize,
        });
        setSubjects(result.subjects);
        // 保存分页信息
        if (result.pagination) {
          setTotal(result.pagination.total);
          setCurrentPage(result.pagination.page);
          setPageSize(result.pagination.limit);
        }
      } catch (error) {
        console.error("获取科目列表失败:", error);
        message.error("获取科目列表失败");
      } finally {
        setLoading(false);
      }
    },
    [currentPage, pageSize]
  );

  // 搜索科目
  const searchSubjects = async (keyword: string) => {
    setSearchKeyword(keyword);
    await fetchSubjects({ searchKeyword: keyword, page: 1 });
  };

  // 添加科目
  const addSubject = async (params: CreateSubjectParams): Promise<Subject> => {
    try {
      const newSubject = await createSubject(params);
      // 创建成功后重新获取列表，确保数据同步
      await fetchSubjects({
        searchKeyword,
        page: currentPage,
        limit: pageSize,
      });
      message.success("科目创建成功");
      return newSubject;
    } catch (error) {
      console.error("创建科目失败:", error);
      message.error("创建科目失败");
      throw error;
    }
  };

  // 编辑科目
  const editSubject = async (
    id: string,
    params: UpdateSubjectParams
  ): Promise<Subject> => {
    try {
      const updatedSubject = await updateSubject(id, params);
      // 更新成功后重新获取列表，确保数据同步
      await fetchSubjects({
        searchKeyword,
        page: currentPage,
        limit: pageSize,
      });
      message.success("科目更新成功");
      return updatedSubject;
    } catch (error) {
      console.error("更新科目失败:", error);
      message.error("更新科目失败");
      throw error;
    }
  };

  // 删除科目
  const removeSubject = async (id: string): Promise<void> => {
    try {
      await deleteSubject(id);
      // 删除成功后重新获取列表，确保数据同步
      await fetchSubjects({
        searchKeyword,
        page: currentPage,
        limit: pageSize,
      });
      message.success("科目删除成功");
    } catch (error) {
      console.error("删除科目失败:", error);
      message.error("删除科目失败");
      throw error;
    }
  };

  // 获取科目详情
  const getSubjectDetail = async (id: string): Promise<Subject> => {
    try {
      const subject = await getSubjectById(id);
      return subject;
    } catch (error) {
      console.error("获取科目详情失败:", error);
      message.error("获取科目详情失败");
      throw error;
    }
  };

  const contextValue: SubjectContextType = {
    subjects,
    loading,
    total,
    currentPage,
    pageSize,
    searchKeyword,
    fetchSubjects,
    searchSubjects,
    addSubject,
    editSubject,
    removeSubject,
    getSubjectDetail,
  };

  return (
    <SubjectContext.Provider value={contextValue}>
      {children}
    </SubjectContext.Provider>
  );
};

export const useSubject = (): SubjectContextType => {
  const context = useContext(SubjectContext);
  if (context === undefined) {
    throw new Error("useSubject must be used within a SubjectProvider");
  }
  return context;
};
