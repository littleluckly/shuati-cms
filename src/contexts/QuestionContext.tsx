import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { getQuestions, deleteQuestion, updateQuestion } from "../api/questions";
import { Question } from "../api/types";
import { message } from "antd";

// 定义上下文类型
interface QuestionContextType {
  questions: Question[];
  searchText: string;
  typeFilter: string;
  difficultyFilter: string;
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  setSearchText: (text: string) => void;
  setTypeFilter: (type: string) => void;
  setDifficultyFilter: (difficulty: string) => void;
  fetchQuestions: (params?: {
    subjectId: string;
    page?: number;
    limit?: number;
    hasAudioFiles?: string;
  }) => Promise<void>;
  handleDelete: (id: string, subjectId: string) => Promise<void>;
  handleUpdateDifficulty: (
    question: Question,
    subjectId: string
  ) => Promise<void>;
  handleUpdateTags: (question: Question, subjectId: string) => Promise<void>;
  handleUpdateQuestion: (
    question: Question,
    subjectId: string
  ) => Promise<void>;
  handleUpdateType: (question: Question, subjectId: string) => Promise<void>;
}

// 创建上下文
const QuestionContext = createContext<QuestionContextType | undefined>(
  undefined
);

// 上下文提供者组件
interface QuestionProviderProps {
  children: ReactNode;
}

export const QuestionProvider: React.FC<QuestionProviderProps> = ({
  children,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // 从API获取题目列表 - 支持筛选参数
  const fetchQuestions = async (params: {
    subjectId: string;
    page?: number;
    limit?: number;
    hasAudioFiles?: string;
  }) => {
    try {
      setLoading(true);
      // 构建API请求参数
      const apiParams: any = {
        subjectId: params.subjectId,
        page: params?.page || 1,
        limit: params?.limit || 10,
      };

      // 添加搜索关键词
      if (searchText) {
        apiParams["searchKeyword"] = searchText;
      }

      // 添加难度筛选
      if (difficultyFilter !== "all") {
        apiParams["difficulty"] = difficultyFilter;
      }

      // 添加类型筛选（需要根据实际API支持的参数格式调整）
      if (typeFilter !== "all") {
        // 这里根据实际API支持的参数进行调整
      }

      // 添加音频文件筛选
      if (params.hasAudioFiles !== undefined) {
        apiParams["hasAudioFiles"] = params.hasAudioFiles === "true";
      }

      const response = await getQuestions(apiParams);
      console.log("获取题目列表:", response);
      setQuestions(response.questions || []);

      // 保存分页信息
      if (response.pagination) {
        setTotal(response.pagination.total || 0);
        setCurrentPage(response.pagination.page || 1);
        setPageSize(response.pagination.limit || 10);
      }
    } catch (error) {
      console.error("获取题目列表错误:", error);
      // 注意：错误处理已在request.ts中统一处理，这里可以根据需要添加额外的错误处理
    } finally {
      setLoading(false);
    }
  };

  // 删除题目
  const handleDelete = async (id: string, subjectId: string) => {
    try {
      await deleteQuestion(id);
      message.success("题目已删除");
      // 删除后重新获取列表数据
      await fetchQuestions({ subjectId });
    } catch (error) {
      console.error("删除题目错误:", error);
      // 注意：错误处理已在request.ts中统一处理，这里可以根据需要添加额外的错误处理
    }
  };

  // 创建通用的更新数据对象
  const createUpdateData = (question: Question) => {
    return {
      type: question.type,
      difficulty: question.difficulty,
      subjectId: question.subjectId,
      tags: question.tags || [],
      question_markdown: question.question_markdown,
      answer_simple_markdown: question.answer_simple_markdown,
      answer_detail_markdown: question.answer_detail_markdown,
      answer_analysis_markdown: question.answer_analysis_markdown,
      options: question.options,
      files: question.files || {},
    };
  };

  // 通用的更新方法
  const handleUpdateQuestionGeneric = async (
    question: Question,
    subjectId: string,
    successMessage: string
  ) => {
    try {
      // 构建完整的更新数据对象
      const updateData = createUpdateData(question);

      await updateQuestion(question._id, updateData);
      message.success(successMessage);
      // 更新后重新获取列表数据
      await fetchQuestions({ subjectId });
    } catch (error) {
      console.error(`更新题目错误:`, error);
      // 注意：错误处理已在request.ts中统一处理，这里可以根据需要添加额外的错误处理
    }
  };

  // 更新题目难度
  const handleUpdateDifficulty = async (
    question: Question,
    subjectId: string
  ) => {
    await handleUpdateQuestionGeneric(question, subjectId, "难度已更新");
  };

  // 更新题目标签
  const handleUpdateTags = async (question: Question, subjectId: string) => {
    await handleUpdateQuestionGeneric(question, subjectId, "标签已更新");
  };

  // 更新题目内容
  const handleUpdateQuestion = async (
    question: Question,
    subjectId: string
  ) => {
    await handleUpdateQuestionGeneric(question, subjectId, "题目标题已更新");
  };

  // 更新题目类型
  const handleUpdateType = async (question: Question, subjectId: string) => {
    await handleUpdateQuestionGeneric(question, subjectId, "题目类型已更新");
  };

  // 无自动刷新逻辑，搜索和筛选仅通过手动触发fetchQuestions实现

  const contextValue: QuestionContextType = {
    questions,
    searchText,
    typeFilter,
    difficultyFilter,
    loading,
    total,
    currentPage,
    pageSize,
    setSearchText,
    setTypeFilter,
    setDifficultyFilter,
    fetchQuestions,
    handleDelete,
    handleUpdateDifficulty,
    handleUpdateTags,
    handleUpdateQuestion,
    handleUpdateType,
  };

  return (
    <QuestionContext.Provider value={contextValue}>
      {children}
    </QuestionContext.Provider>
  );
};

// 自定义Hook用于使用上下文
export const useQuestion = (): QuestionContextType => {
  const context = useContext(QuestionContext);
  if (context === undefined) {
    throw new Error("useQuestion must be used within a QuestionProvider");
  }
  return context;
};
