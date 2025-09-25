import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Card,
  Switch,
  Select,
  Divider,
  Tag,
  Space,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  createSubject,
  updateSubject,
  getSubjectById,
} from "../../api/subjects";
import {
  Subject,
  CreateSubjectParams,
  UpdateSubjectParams,
} from "../../api/types";

const { Option } = Select;

interface SubjectTag {
  name: string;
  value: string;
}

const SubjectForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [existingTags, setExistingTags] = useState<SubjectTag[]>([]);
  const [existingUserTags, setExistingUserTags] = useState<SubjectTag[]>([]);
  const [systemTagName, setSystemTagName] = useState<string>("");
  const [systemTagValue, setSystemTagValue] = useState<string>("");
  const [userTagName, setUserTagName] = useState<string>("");
  const [userTagType, setUserTagType] = useState<string>("");

  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // 加载科目详情（编辑模式）
  useEffect(() => {
    if (id) {
      setIsEditing(true);
      loadSubjectDetail(id);
    }
  }, [id]);

  const loadSubjectDetail = async (subjectId: string) => {
    setLoading(true);
    try {
      const subject = await getSubjectById(subjectId);
      form.setFieldsValue({
        name: subject.name,
        code: subject.code,
        description: subject.description,
        isEnabled: subject.isEnabled,
      });
    } catch (error) {
      console.error("获取科目详情失败:", error);
      message.error("获取科目详情失败");
    } finally {
      setLoading(false);
    }
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      setLoading(true);

      if (isEditing && id) {
        // 编辑模式
        const updateParams: UpdateSubjectParams = {
          name: values.name,
          description: values.description,
          isEnabled: values.isEnabled,
        };

        await updateSubject(id, updateParams);
        message.success("科目更新成功");
      } else {
        // 创建模式
        const createParams: CreateSubjectParams = {
          name: values.name,
          code: values.code,
          description: values.description,
          userTags: existingUserTags.length > 0 ? existingUserTags : undefined,
          isEnabled: values.isEnabled !== undefined ? values.isEnabled : true,
        };

        await createSubject(createParams);
        message.success("科目创建成功");
      }

      navigate("/subjects");
    } catch (error) {
      console.error(isEditing ? "更新科目失败:" : "创建科目失败:", error);
      message.error(isEditing ? "科目更新失败" : "科目创建失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={isEditing ? "编辑科目" : "新增科目"}
      loading={loading}
      extra={
        <Button onClick={() => navigate("/subjects")} disabled={loading}>
          取消
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={loading}
        initialValues={{
          isEnabled: true,
        }}
      >
        <Form.Item
          name="name"
          label="科目名称"
          rules={[{ required: true, message: "请输入科目名称" }]}
        >
          <Input placeholder="请输入科目名称" />
        </Form.Item>

        <Form.Item
          name="code"
          label="科目代码"
          rules={[
            { required: true, message: "请输入科目代码" },
            {
              pattern: /^[A-Za-z0-9_]+$/,
              message: "科目代码只能包含字母、数字和下划线",
            },
          ]}
          hidden={isEditing} // 编辑模式下不允许修改科目代码
        >
          <Input placeholder="请输入科目代码（唯一标识，只能包含字母、数字和下划线）" />
        </Form.Item>

        <Form.Item name="description" label="科目描述">
          <Input.TextArea rows={4} placeholder="请输入科目描述" />
        </Form.Item>

        <Divider>状态设置</Divider>

        <Form.Item name="isEnabled" label="是否启用" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEditing ? "更新科目" : "创建科目"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SubjectForm;
