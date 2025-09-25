import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Tag, Space, Button, Popconfirm, Typography } from "antd";
import { Subject } from "../../types";
import { useNavigate } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { AnyObject } from "antd/es/_util/type";

const { Title, Text } = Typography;

export default (handleDelete: (id: string, name: string) => void) => {
  const navigate = useNavigate();
  const columns: ColumnsType<AnyObject> = [
    {
      title: "科目名称",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Subject) => <Text strong>{text}</Text>,
    },
    {
      title: "科目代码",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "状态",
      dataIndex: "isEnabled",
      key: "isEnabled",
      render: (isEnabled: boolean) => (
        <Tag color={isEnabled ? "green" : "red"}>
          {isEnabled ? "启用" : "禁用"}
        </Tag>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 160,
      render: (date: string) => date && new Date(date).toLocaleString("zh-CN"),
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      render: (_: any, record: Subject) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/subjects/edit/${record._id}`)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除吗？"
            onConfirm={() => handleDelete(record._id, record.name)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return { columns };
};
