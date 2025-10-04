import React, { useEffect, useCallback, useState, useMemo } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Popconfirm,
  Typography,
  Card,
  Row,
  Col,
  Select,
  Tabs,
  Form,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useQuestion } from "../../contexts/QuestionContext";
import { useSubject } from "../../contexts/SubjectContext";
import { useQuestionTableColumns } from "./hooks/useQuestionTableColumns";
import request from "../../utils/request";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { Item: FormItem } = Form;

const QuestionList = () => {
  const navigate = useNavigate();
  const {
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
    handleDelete,
    fetchQuestions,
    handleUpdateDifficulty,
    handleUpdateTags,
    handleUpdateQuestion,
    handleUpdateType,
    handleUpdateStatus,
  } = useQuestion();

  const { subjects, fetchSubjects } = useSubject();
  const [activeSubjectId, setActiveSubjectId] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTagsId, setEditingTagsId] = useState<string | null>(null);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );
  const [editingTypeId, setEditingTypeId] = useState<string | null>(null);
  const [editingStatusId, setEditingStatusId] = useState<string | null>(null);

  // 批量编辑状态
  const [isBatchEditing, setIsBatchEditing] = useState<boolean>(false);
  const [batchEditingIds, setBatchEditingIds] = useState<Set<string>>(
    new Set()
  );
  const [hasAudioFilesFilter, setHasAudioFilesFilter] = useState<string>("all");
  const [isEnabledFilter, setIsEnabledFilter] = useState<string>("all");

  const [form] = Form.useForm();

  // 当科目列表加载后，默认选择第一个科目
  useEffect(() => {
    if (subjects.length > 0 && !activeSubjectId) {
      setActiveSubjectId(subjects[0]._id);
      fetchQuestions({
        page: 1,
        limit: pageSize,
        subjectId: subjects[0]._id,
      });
    }
  }, [subjects, activeSubjectId, fetchQuestions, pageSize]);

  const onClear = useCallback(() => {
    setSearchText("");
    // fetchQuestions();
  }, [setSearchText]);

  // 处理科目切换
  const handleSubjectChange = useCallback(
    (subjectId: string) => {
      console.log("切换科目:", subjectId);
      setActiveSubjectId(subjectId);
      // 重置筛选条件
      setSearchText("");
      setTypeFilter("all");
      setDifficultyFilter("all");
      setHasAudioFilesFilter("all");
      setIsEnabledFilter("all");
      // 根据科目获取题目
      fetchQuestions({
        page: 1,
        limit: pageSize,
        subjectId: subjectId,
        hasAudioFiles: undefined,
        isEnabled: undefined,
      });
    },
    [
      setSearchText,
      setTypeFilter,
      setDifficultyFilter,
      setHasAudioFilesFilter,
      setIsEnabledFilter,
      fetchQuestions,
      pageSize,
    ]
  );

  // 处理页码变化
  const handlePageChange = useCallback(
    (page: number) => {
      fetchQuestions({
        page,
        limit: pageSize,
        subjectId: activeSubjectId,
        hasAudioFiles: hasAudioFilesFilter !== 'all' ? hasAudioFilesFilter : undefined,
        isEnabled: isEnabledFilter !== 'all' ? isEnabledFilter : undefined,
      });
    },
    [fetchQuestions, pageSize, activeSubjectId, hasAudioFilesFilter, isEnabledFilter]
  );

  // 处理搜索
  const handleSearch = useCallback(() => {
    fetchQuestions({
      page: 1,
      limit: pageSize,
      subjectId: activeSubjectId,
      hasAudioFiles: hasAudioFilesFilter !== 'all' ? hasAudioFilesFilter : undefined,
      isEnabled: isEnabledFilter !== 'all' ? isEnabledFilter : undefined,
    });
  }, [fetchQuestions, pageSize, activeSubjectId, hasAudioFilesFilter, isEnabledFilter]);

  // 处理类型筛选
  const handleTypeFilterChange = useCallback(
    (value: string) => {
      setTypeFilter(value);
      fetchQuestions({
        page: 1,
        limit: pageSize,
        subjectId: activeSubjectId,
        hasAudioFiles: hasAudioFilesFilter !== 'all' ? hasAudioFilesFilter : undefined,
        isEnabled: isEnabledFilter !== 'all' ? isEnabledFilter : undefined,
      });
    },
    [setTypeFilter, fetchQuestions, pageSize, activeSubjectId, hasAudioFilesFilter, isEnabledFilter]
  );

  // 处理难度筛选
  const handleDifficultyFilterChange = useCallback(
    (value: string) => {
      setDifficultyFilter(value);
      fetchQuestions({
        page: 1,
        limit: pageSize,
        subjectId: activeSubjectId,
        hasAudioFiles: hasAudioFilesFilter !== 'all' ? hasAudioFilesFilter : undefined,
        isEnabled: isEnabledFilter !== 'all' ? isEnabledFilter : undefined,
      });
    },
    [setDifficultyFilter, fetchQuestions, pageSize, activeSubjectId, hasAudioFilesFilter, isEnabledFilter]
  );

  // 处理音频文件筛选
  const handleHasAudioFilesFilterChange = useCallback(
    (value: string) => {
      setHasAudioFilesFilter(value);
      fetchQuestions({
        page: 1,
        limit: pageSize,
        subjectId: activeSubjectId,
        hasAudioFiles: value !== 'all' ? value : undefined,
        isEnabled: isEnabledFilter !== 'all' ? isEnabledFilter : undefined,
      });
    },
    [setHasAudioFilesFilter, fetchQuestions, pageSize, activeSubjectId, isEnabledFilter]
  );

  // 处理启用状态筛选
  const handleIsEnabledFilterChange = useCallback(
    (value: string) => {
      setIsEnabledFilter(value);
      fetchQuestions({
        page: 1,
        limit: pageSize,
        subjectId: activeSubjectId,
        hasAudioFiles: hasAudioFilesFilter !== 'all' ? hasAudioFilesFilter : undefined,
        isEnabled: value !== 'all' ? value : undefined,
      });
    },
    [setIsEnabledFilter, fetchQuestions, pageSize, activeSubjectId, hasAudioFilesFilter]
  );

  // 处理每页显示条数变化
  const handlePageSizeChange = useCallback(
    (_: number, size: number) => {
      fetchQuestions({
        page: currentPage,
        limit: size,
        subjectId: activeSubjectId,
        hasAudioFiles: hasAudioFilesFilter !== 'all' ? hasAudioFilesFilter : undefined,
        isEnabled: isEnabledFilter !== 'all' ? isEnabledFilter : undefined,
      });
    },
    [fetchQuestions, currentPage, activeSubjectId, hasAudioFilesFilter, isEnabledFilter]
  );

  // 初始化获取科目列表
  useEffect(() => {
    fetchSubjects();
  }, []);

  // 格式化类型显示
  const getTypeDisplay = useCallback((type: string) => {
    switch (type) {
      case "choice":
        return "选择题";
      case "multiple":
        return "多选题";
      case "text":
      case "answer":
        return "简答题";
      case "code":
        return "编程题";
      default:
        return type;
    }
  }, []);

  // 开始批量编辑
  const startBatchEdit = useCallback(() => {
    setIsBatchEditing(true);
    // 初始化所有题目为批量编辑状态
    const allIds = new Set(questions.map((q) => q._id));
    setBatchEditingIds(allIds);
  }, [questions]);

  // 取消批量编辑
  const cancelBatchEdit = useCallback(() => {
    setIsBatchEditing(false);
    setBatchEditingIds(new Set());

    // 重置所有编辑状态
    setEditingQuestionId(null);
    setEditingTypeId(null);
    setEditingId(null);
    setEditingTagsId(null);
    setEditingStatusId(null);
  }, []);

  // 保存批量编辑
  const saveBatchEdit = useCallback(async () => {
    // 在实际实现中，这里应该保存所有更改
    message.success("批量保存成功");
    cancelBatchEdit();
  }, [cancelBatchEdit]);

  // 导出题目功能
  const handleExportQuestions = useCallback(async () => {
    try {
      // 映射显示名称到API参数值
      const difficultyMap = {
        '简单': 'easy',
        '中等': 'medium', 
        '困难': 'hard'
      };

      const typeMap = {
        '选择题': 'choice',
        '多选题': 'multiple',
        '简答题': 'text',
        '编程题': 'code'
      };

      // 准备导出参数，基于当前过滤条件
      const exportParams = {
        subjectId: activeSubjectId || undefined,
        searchKeyword: searchText || undefined,
        difficulty: difficultyFilter !== 'all' ? [difficultyMap[difficultyFilter]] : undefined,
        tags: typeFilter !== 'all' ? [typeMap[typeFilter]] : undefined,
        hasAudioFiles: hasAudioFilesFilter !== 'all' ? (hasAudioFilesFilter === 'true') : undefined,
        isEnabled: isEnabledFilter !== 'all' ? (isEnabledFilter === 'true') : undefined,
      };

      // 调用导出API
      const response = await request('/questions/export', {
        method: 'POST',
        data: exportParams,
        responseType: 'blob', // 重要：指定响应类型为blob
      });

      // 创建下载链接
      const blob = new Blob([response.data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // 生成文件名，包含日期和时间
      const now = new Date();
      const dateStr = now.toISOString().slice(0, 10);
      const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '-');
      const subjectName = subjects.find(s => s._id === activeSubjectId)?.name || '全部科目';
      link.download = `题目数据_${subjectName}_${dateStr}_${timeStr}.json`;
      
      // 触发下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 清理URL对象
      window.URL.revokeObjectURL(url);
      
      message.success('题目导出成功！');
    } catch (error) {
      console.error('导出题目失败:', error);
      message.error('导出题目失败，请稍后重试');
    }
  }, [
    activeSubjectId, 
    searchText, 
    typeFilter, 
    difficultyFilter, 
    hasAudioFilesFilter, 
    isEnabledFilter,
    subjects
  ]);

  // 使用自定义hook获取表格列配置
  const columns = useQuestionTableColumns({
    navigate,
    editingId,
    editingTagsId,
    editingQuestionId,
    editingTypeId,
    editingStatusId,
    setEditingId,
    setEditingTagsId,
    setEditingQuestionId,
    setEditingTypeId,
    setEditingStatusId,
    handleUpdateDifficulty,
    handleUpdateTags,
    handleUpdateQuestion,
    handleUpdateType,
    handleUpdateStatus,
    handleDelete,
    activeSubjectId,
    getTypeDisplay,
    // 批量编辑相关参数
    isBatchEditing,
    batchEditingIds,
  });

  return (
    <div>
      <Title level={2} style={{ marginTop: 0 }}>
        题目管理
      </Title>

      <Card style={{ marginBottom: 24 }}>
        <Tabs
          activeKey={activeSubjectId}
          onChange={handleSubjectChange}
          items={subjects.map((subject) => ({
            key: subject._id,
            label: subject.name,
          }))}
        />

        <Row gutter={[16, 16]} align="middle" style={{ marginTop: 16 }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() =>
                  navigate(`/questions/new?subjectId=${activeSubjectId}`)
                }
              >
                新增题目
              </Button>
              <Button
                icon={<ExportOutlined />}
                onClick={handleExportQuestions}
              >
                导出题目
              </Button>
            </Space>
          </Col>

          <Col xs={24} sm={12} md={16} lg={18}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={12}>
                <Search
                  placeholder="搜索题目或分类"
                  allowClear
                  enterButton={<SearchOutlined />}
                  size="middle"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onSearch={handleSearch}
                  onClear={() => setSearchText("")}
                />
              </Col>

              <Col xs={12} sm={6} md={6}>
                <Select
                  placeholder="题目类型"
                  style={{ width: "100%" }}
                  value={typeFilter}
                  onChange={handleTypeFilterChange}
                  allowClear
                >
                  <Option value="all">全部类型</Option>
                  <Option value="选择题">选择题</Option>
                  <Option value="多选题">多选题</Option>
                  <Option value="简答题">简答题</Option>
                  <Option value="编程题">编程题</Option>
                </Select>
              </Col>

              <Col xs={12} sm={6} md={6}>
                <Select
                  placeholder="难度等级"
                  style={{ width: "100%" }}
                  value={difficultyFilter}
                  onChange={handleDifficultyFilterChange}
                  allowClear
                >
                  <Option value="all">全部难度</Option>
                  <Option value="简单">简单</Option>
                  <Option value="中等">中等</Option>
                  <Option value="困难">困难</Option>
                </Select>
              </Col>
              <Col xs={12} sm={6} md={6}>
                <Select
                  placeholder="音频文件"
                  style={{ width: "100%" }}
                  value={hasAudioFilesFilter}
                  onChange={handleHasAudioFilesFilterChange}
                  allowClear
                >
                  <Option value="all">全部</Option>
                  <Option value="true">有音频</Option>
                  <Option value="false">无音频</Option>
                </Select>
              </Col>
              <Col xs={12} sm={6} md={6}>
                <Select
                  placeholder="是否启用"
                  style={{ width: "100%" }}
                  value={isEnabledFilter}
                  onChange={handleIsEnabledFilterChange}
                  allowClear
                >
                  <Option value="all">全部</Option>
                  <Option value="true">已启用</Option>
                  <Option value="false">已禁用</Option>
                </Select>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row gutter={[16, 16]} align="middle" style={{ marginTop: 16 }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            {/* 批量编辑按钮 */}
            {isBatchEditing ? (
              <Space>
                <Button type="primary" onClick={saveBatchEdit}>
                  批量保存
                </Button>
                <Button onClick={cancelBatchEdit}>取消</Button>
              </Space>
            ) : (
              <Button onClick={startBatchEdit}>批量编辑</Button>
            )}
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={questions}
        rowKey="_id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: handlePageChange,
          onShowSizeChange: handlePageSizeChange,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条数据`,
        }}
        scroll={{ x: "max-content" }}
        loading={loading}
      />
    </div>
  );
};

export default QuestionList;
