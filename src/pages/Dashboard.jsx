import { Card, Statistic, Row, Col, List, Typography, Table } from 'antd';
import { 
  QuestionCircleOutlined, 
  UserOutlined, 
  BarChartOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

// 模拟数据
const recentQuestions = [
  { id: 1, title: "React生命周期有哪些阶段？", type: "选择题", status: "已发布" },
  { id: 2, title: "解释JavaScript中的原型链", type: "简答题", status: "草稿" },
  { id: 3, title: "如何实现一个防抖函数？", type: "编程题", status: "已发布" },
];

const difficultyData = [
  { name: '简单', count: 120 },
  { name: '中等', count: 250 },
  { name: '困难', count: 80 },
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
              valueStyle={{ color: '#3f8600' }}
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
              valueStyle={{ color: '#1890ff' }}
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
              valueStyle={{ color: '#722ed1' }}
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
              valueStyle={{ color: '#faad14' }}
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
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    description={
                      <div>
                        <Text type="secondary">类型：{item.type}</Text>
                        <Text style={{ marginLeft: 16 }} type={item.status === "已发布" ? "success" : "warning"}>
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
            <Table dataSource={difficultyData} columns={[
              { title: '难度等级', dataIndex: 'name', key: 'name' },
              { title: '题目数量', dataIndex: 'count', key: 'count' },
              { 
                title: '占比', 
                key: 'percentage',
                render: (_, record) => {
                  const percentage = ((record.count / 450) * 100).toFixed(1);
                  return `${percentage}%`;
                }
              }
            ]} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
