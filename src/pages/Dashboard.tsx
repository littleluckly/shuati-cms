import { Card, Statistic, Row, Col, List, Typography, Table } from "antd";
import {
  QuestionCircleOutlined,
  UserOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
import { Question, StatData } from "../types";

// 注意：为了符合类型定义，这里使用了接口中实际存在的属性
// 并添加了必要的类型断言来处理接口中不存在但在UI中需要使用的字段
const recentQuestions: (Question & {
  id: string;
  title: string;
  category?: string;
  status?: string;
})[] = [
  {
    _id: "1",
    id: "1",
    title: "React生命周期有哪些阶段？",
    type: "multiple",
    difficulty: "medium",
    category: "React",
    status: "已发布",
    subjectId: "68c38c2355855886d48562d2",
    tags: ["React", "生命周期"],
    question_markdown: "React生命周期有哪些阶段？",
    answer_simple_markdown: "React生命周期包括挂载阶段、更新阶段和卸载阶段。",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    _id: "2",
    id: "2",
    title: "解释JavaScript中的原型链",
    type: "answer",
    difficulty: "hard",
    category: "JavaScript",
    status: "草稿",
    subjectId: "68c38c2355855886d48562d2",
    tags: ["JavaScript", "原型链"],
    question_markdown: "解释JavaScript中的原型链",
    answer_simple_markdown: "原型链是JavaScript中实现继承的机制。",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    _id: "3",
    id: "3",
    title: "如何实现一个防抖函数？",
    type: "programming",
    difficulty: "easy",
    category: "JavaScript",
    status: "已发布",
    subjectId: "68c38c2355855886d48562d2",
    tags: ["JavaScript", "防抖"],
    question_markdown: "如何实现一个防抖函数？",
    answer_simple_markdown: "防抖函数用于限制函数在短时间内的重复执行。",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const difficultyData: StatData[] = [
  { name: "简单", count: 120 },
  { name: "中等", count: 250 },
  { name: "困难", count: 80 },
];

const Dashboard = () => {
  return (
    <div>
      <Title level={2}>仪表盘</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总题目数"
              value={450}
              precision={0}
              valueStyle={{ color: "#3f8600" }}
              prefix={<QuestionCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="活跃用户"
              value={1250}
              precision={0}
              valueStyle={{ color: "#1890ff" }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日答题量"
              value={328}
              precision={0}
              valueStyle={{ color: "#722ed1" }}
              prefix={<BarChartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已完成题目"
              value={15600}
              precision={0}
              valueStyle={{ color: "#faad14" }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title="最近添加的题目">
            <List
              dataSource={recentQuestions}
              renderItem={(item) => (
                <List.Item key={item.id}>
                  <List.Item.Meta
                    title={item.title}
                    description={
                      <div>
                        <Text type="secondary">类型：{item.type}</Text>
                        <Text
                          style={{ marginLeft: 16 }}
                          type={
                            item.status === "已发布" ? "success" : "warning"
                          }
                        >
                          {item.status}
                        </Text>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card title="题目难度分布">
            <Table
              dataSource={difficultyData}
              rowKey="name"
              columns={[
                { title: "难度等级", dataIndex: "name", key: "name" },
                { title: "题目数量", dataIndex: "count", key: "count" },
                {
                  title: "占比",
                  key: "percentage",
                  render: (_, record) => {
                    const percentage = ((record.count / 450) * 100).toFixed(1);
                    return `${percentage}%`;
                  },
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
