import React, { useEffect, useCallback, useState } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  Popconfirm,
  Typography,
  Card,
  Row,
  Col,
  Select,
  Tabs,
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

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;
const { TabPane } = Tabs;

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
  } = useQuestion();

  const { subjects, fetchSubjects } = useSubject();
  const [activeSubjectId, setActiveSubjectId] = useState<string>("");

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
  const handleSubjectChange = (subjectId: string) => {
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
  };

  // 处理页码变化
  const handlePageChange = (page: number) => {
    fetchQuestions({
      page,
      limit: pageSize,
      subjectId: activeSubjectId,
    });
  };

  // 处理搜索
  const handleSearch = () => {
    fetchQuestions({
      page: 1,
      limit: pageSize,
      subjectId: activeSubjectId,
    });
  };

  // 处理类型筛选
  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value);
    fetchQuestions({
      page: 1,
      limit: pageSize,
      subjectId: activeSubjectId,
    });
  };

  // 处理难度筛选
  const handleDifficultyFilterChange = (value: string) => {
    setDifficultyFilter(value);
    fetchQuestions({
      page: 1,
      limit: pageSize,
      subjectId: activeSubjectId,
    });
  };

  // 处理每页显示条数变化
  const handlePageSizeChange = (_: number, size: number) => {
    fetchQuestions({
      page: currentPage,
      limit: size,
      subjectId: activeSubjectId,
    });
  };

  // 初始化获取科目列表
  useEffect(() => {
    fetchSubjects();
  }, []);

  // 格式化类型显示
  const getTypeDisplay = (type) => {
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
  };

  // 格式化难度标签
  const getDifficultyTag = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return <Tag color="green">简单</Tag>;
      case "medium":
        return <Tag color="orange">中等</Tag>;
      case "hard":
        return <Tag color="red">困难</Tag>;
      default:
        return <Tag>{difficulty}</Tag>;
    }
  };

  const columns = [
    {
      title: "题目",
      dataIndex: "question_markdown",
      key: "question_markdown",
      ellipsis: true,
      width: "30%",
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      render: (type) => getTypeDisplay(type),
    },
    {
      title: "难度",
      dataIndex: "difficulty",
      key: "difficulty",
      render: (difficulty) => getDifficultyTag(difficulty),
    },
    {
      title: "标签",
      dataIndex: "tags",
      key: "tags",
      render: (tags) => (
        <Space size="small">
          {tags?.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/questions/edit/${record._id}`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个题目吗？"
            onConfirm={() => handleDelete(record._id, record.subjectId)}
            okText="是"
            cancelText="否"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
