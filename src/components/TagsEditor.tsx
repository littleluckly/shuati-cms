import React from "react";
import { Form, Select, Tag, Space, message } from "antd";
import { Question } from "../api/types";

const FormItem = Form.Item;

interface TagsEditorProps {
  question: Question;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updatedQuestion: Question) => Promise<void>;
  onCancel: () => void;
  activeSubjectId: string;
}

const TagsEditor: React.FC<TagsEditorProps> = ({
  question,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  activeSubjectId,
}) => {
  const [form] = Form.useForm();

  // 处理编辑
  const handleEdit = () => {
    onEdit();
    form.setFieldsValue({
      tags: question.tags || [],
    });
  };

  // 保存修改
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const newTags = values.tags || [];
      const oldTags = question.tags || [];
      
      // 检查标签是否实际发生了变化
      const tagsChanged = 
        newTags.length !== oldTags.length || 
        !newTags.every(tag => oldTags.includes(tag)) ||
        !oldTags.every(tag => newTags.includes(tag));
      
      // 只有在标签发生变化时才触发更新
      if (tagsChanged) {
        // 创建更新后的题目对象，参照 QuestionForm.tsx 的实现
        const updatedQuestion = {
          ...question,
          tags: newTags,
          // 确保所有必要的字段都存在
          type: question.type || "single",
          subjectId: question.subjectId,
          difficulty: question.difficulty,
          question_markdown: question.question_markdown || "",
          answer_simple_markdown: question.answer_simple_markdown || "",
          answer_detail_markdown: question.answer_detail_markdown || "",
          answer_analysis_markdown: question.answer_analysis_markdown || "",
          options: question.options,
          files: question.files || {},
        };
        await onSave(updatedQuestion);
      }
      
      onCancel();
    } catch (error) {
      console.error("保存标签失败:", error);
      message.error("保存标签失败");
    }
  };

  if (isEditing) {
    return (
      <Form form={form} initialValues={{ tags: question.tags }}>
        <FormItem
          name="tags"
          rules={[{ required: false }]}
        >
          <Select
            mode="tags"
            style={{ width: "100%" }}
            placeholder="请输入标签，按回车确认"
            onBlur={handleSave}
            autoFocus
          />
        </FormItem>
      </Form>
    );
  }

  return (
    <div
      style={{ cursor: "pointer" }}
      onClick={handleEdit}
    >
      <Space size="small">
        {question.tags?.map((tag, index) => (
          <Tag key={index}>{tag}</Tag>
        ))}
        {!question.tags || question.tags.length === 0 ? (
          <Tag style={{ borderStyle: "dashed", borderColor: "#d9d9d9" }}>
            添加标签
          </Tag>
        ) : null}
      </Space>
    </div>
  );
};

export default TagsEditor;