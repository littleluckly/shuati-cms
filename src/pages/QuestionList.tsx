import { useState, useEffect } from 'react';
import { 
  Table, Button, Input, Space, Tag, Popconfirm, 
  message, Typography, Card, Row, Col, Select 
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  SearchOutlined, FilterOutlined 
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Question } from '../types';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

// 模拟题目数据
const mockQuestions = [
  {
    id: uuidv4(),
    title: "React中useState的作用是什么？",
    type: "选择题",
    difficulty: "简单",
    category: "前端框架",
    status: "已发布",
    createdAt: "2023-10-01",
    updatedAt: "2023-10-01"
  },
  {
    id: uuidv4(),
    title: "解释JavaScript中的闭包概念及其应用场景",
    type: "简答题",
    difficulty: "中等",
    category: "JavaScript",
    status: "已发布",
    createdAt: "2023-10-02",
    updatedAt: "2023-10-03"
  },
  {
    id: uuidv4(),
    title: "实现一个快速排序算法",
    type: "编程题",
    difficulty: "困难",
    category: "算法",
    status: "草稿",
    createdAt: "2023-10-05",
    updatedAt: "2023-10-05"
  },
  {
    id: uuidv4(),
    title: "CSS中的flex布局有哪些常用属性？",
    type: "多选题",
    difficulty: "简单",
    category: "CSS",
    status: "已发布",
    createdAt: "2023-10-06",
    updatedAt: "2023-10-06"
  },
  {
    id: uuidv4(),
    title: "如何优化React应用的性能？",
    type: "简答题",
    difficulty: "中等",
    category: "前端框架",
    status: "草稿",
    createdAt: "2023-10-08",
    updatedAt: "2023-10-09"
  },
];

const QuestionList = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const navigate = useNavigate();

  // 初始化数据
  useEffect(() => {
    // 实际项目中这里会从API获取数据
    setQuestions(mockQuestions);
    setFilteredQuestions(mockQuestions);
  }, []);

  // 筛选数据
  useEffect(() => {
    let result = [...questions];
    
    // 搜索筛选
    if (searchText) {
      result = result.filter(q => 
        q.title.toLowerCase().includes(searchText.toLowerCase()) ||
        q.category.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    
    // 类型筛选
    if (typeFilter !== 'all') {
      result = result.filter(q => q.type === typeFilter);
    }
    
    // 难度筛选
    if (difficultyFilter !== 'all') {
      result = result.filter(q => q.difficulty === difficultyFilter);
    }
    
    setFilteredQuestions(result);
  }, [questions, searchText, typeFilter, difficultyFilter]);

  // 删除题目
  const handleDelete = (id) => {
    const newQuestions = questions.filter(q => q.id !== id);
    setQuestions(newQuestions);
    message.success('题目已删除');
  };

  // 格式化状态标签
  const getStatusTag = (status) => {
    switch(status) {
      case '已发布':
        return <Tag color="success">已发布</Tag>;
      case '草稿':
        return <Tag color="warning">草稿</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  // 格式化难度标签
  const getDifficultyTag = (difficulty) => {
    switch(difficulty) {
      case '简单':
        return <Tag color="green">简单</Tag>;
      case '中等':
        return <Tag color="orange">中等</Tag>;
      case '困难':
        return <Tag color="red">困难</Tag>;
      default:
        return <Tag>{difficulty}</Tag>;
    }
  };

  const columns = [
    {
      title: '题目名称',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: '30%',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: '选择题', value: '选择题' },
        { text: '多选题', value: '多选题' },
        { text: '简答题', value: '简答题' },
        { text: '编程题', value: '编程题' },
      ],
      onFilter: (value, record) => record.type === value,
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (difficulty) => getDifficultyTag(difficulty),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => navigate(`/questions/edit/${record.id}`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个题目吗？"
            onConfirm={() => handleDelete(record.id)}
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
      <Title level={2}>题目管理</Title>
      
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
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
                />
              </Col>
              
              <Col xs={12} sm={6} md={6}>
                <Select
                  placeholder="题目类型"
                  style={{ width: '100%' }}
                  value={typeFilter}
                  onChange={setTypeFilter}
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
                  style={{ width: '100%' }}
                  value={difficultyFilter}
                  onChange={setDifficultyFilter}
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
        dataSource={filteredQuestions} 
        rowKey="id" 
        pagination={{ pageSize: 10 }}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default QuestionList;
