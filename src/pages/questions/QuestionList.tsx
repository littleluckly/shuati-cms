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
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useQuestion } from "../../contexts/QuestionContext";
import { useSubject } from "../../contexts/SubjectContext";
import { useQuestionTableColumns } from "./hooks/useQuestionTableColumns";

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;
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
  } = useQuestion();

  const { subjects, fetchSubjects } = useSubject();
  const [activeSubjectId, setActiveSubjectId] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTagsId, setEditingTagsId] = useState<string | null>(null);
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
      // 根据科目获取题目
      fetchQuestions({
        page: 1,
        limit: pageSize,
        subjectId: subjectId,
      });
    },
    [
      setSearchText,
      setTypeFilter,
      setDifficultyFilter,
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
      });
    },
    [fetchQuestions, pageSize, activeSubjectId]
  );

  // 处理搜索
  const handleSearch = useCallback(() => {
    fetchQuestions({
      page: 1,
      limit: pageSize,
      subjectId: activeSubjectId,
    });
  }, [fetchQuestions, pageSize, activeSubjectId]);

  // 处理类型筛选
  const handleTypeFilterChange = useCallback(
    (value: string) => {
      setTypeFilter(value);
      fetchQuestions({
        page: 1,
        limit: pageSize,
        subjectId: activeSubjectId,
      });
    },
    [setTypeFilter, fetchQuestions, pageSize, activeSubjectId]
  );

  // 处理难度筛选
  const handleDifficultyFilterChange = useCallback(
    (value: string) => {
      setDifficultyFilter(value);
      fetchQuestions({
        page: 1,
        limit: pageSize,
        subjectId: activeSubjectId,
      });
    },
    [setDifficultyFilter, fetchQuestions, pageSize, activeSubjectId]
  );

  // 处理每页显示条数变化
  const handlePageSizeChange = useCallback(
    (_: number, size: number) => {
      fetchQuestions({
        page: currentPage,
        limit: size,
        subjectId: activeSubjectId,
      });
    },
    [fetchQuestions, currentPage, activeSubjectId]
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

  // 使用自定义hook获取表格列配置
  const columns = useQuestionTableColumns({
    navigate,
    editingId,
    editingTagsId,
    setEditingId,
    setEditingTagsId,
    handleUpdateDifficulty,
    handleUpdateTags,
    handleDelete,
    activeSubjectId,
    getTypeDisplay,
  });

  return (
    <div>
      <Title level={2} style={{ marginTop: 0 }}>
        题目管理
      </Title>

      <Card style={{ marginBottom: 24 }}>
        <Tabs activeKey={activeSubjectId} onChange={handleSubjectChange}>
          {subjects.map((subject) => (
            <TabPane tab={subject.name} key={subject._id} />
          ))}
        </Tabs>

        <Row gutter={[16, 16]} align="middle" style={{ marginTop: 16 }}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate("/questions/new")}
            >
              新增题目
            </Button>
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
            </Row>
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
