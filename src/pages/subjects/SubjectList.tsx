import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Popconfirm,
  message,
  Typography,
  Modal,
  Input,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { Subject } from "../../api/types";
import { useSubject } from "../../contexts/SubjectContext";
import useColumns from "./useColumns";

const { Title, Text } = Typography;
const { confirm } = Modal;
const { Search } = Input;

// 从API获取数据
// 从API获取数据

const SubjectList: React.FC = () => {
  const {
    subjects,
    loading,
    searchSubjects,
    removeSubject,
    total,
    currentPage,
    pageSize,
    fetchSubjects,
  } = useSubject();
  const [searchValue, setSearchValue] = useState<string>("");
  const navigate = useNavigate();

  // 搜索科目
  const handleSearch = (value: string) => {
    setSearchValue(value);
    searchSubjects(value);
  };

  // 处理页码变化
  const handlePageChange = (page: number, pageSize: number) => {
    fetchSubjects({ page, limit: pageSize });
  };

  // 处理页面大小变化
  const handlePageSizeChange = (current: number, size: number) => {
    fetchSubjects({ page: current, limit: size });
  };

  // 删除科目
  const handleDelete = (id: string, name: string) => {
    confirm({
      title: "确定要删除这个科目吗？",
      icon: <ExclamationCircleOutlined />,
      content: `删除科目 "${name}" 后，相关的题目数据也将受到影响。`,
      okText: "确定",
      okType: "danger",
      cancelText: "取消",
      onOk: async () => {
        try {
          await removeSubject(id);
          message.success("科目删除成功");
        } catch (error) {
          console.error("删除科目失败:", error);
          message.error("删除科目失败");
        }
      },
    });
  };

  const { columns } = useColumns(handleDelete);

  // 初始化获取科目列表
  useEffect(() => {
    fetchSubjects({ page: 1, limit: pageSize });
  }, []);
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          科目管理
        </Title>
        <Space>
          <Search
            placeholder="搜索科目名称、代码或描述"
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ width: 300 }}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/subjects/create")}
          >
            新增科目
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={subjects}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: handlePageChange,
          onShowSizeChange: handlePageSizeChange,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条数据`,
        }}
        locale={{
          emptyText: "暂无科目数据",
        }}
      />
    </div>
  );
};

export default SubjectList;
