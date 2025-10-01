import React from "react";
import { Form, Switch, message } from "antd";
import { Question } from "../../../api/types";

const FormItem = Form.Item;

interface StatusEditorProps {
  question: Question;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updatedQuestion: Question) => Promise<void>;
  onCancel: () => void;
  activeSubjectId: string;
}

const StatusEditor: React.FC<StatusEditorProps> = ({
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
      isEnabled: question.isEnabled ?? true,
    });
  };

  // 保存修改
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const newIsEnabled = values.isEnabled;
      const oldIsEnabled = question.isEnabled ?? true;

      // 检查状态是否实际发生了变化
      const statusChanged = newIsEnabled !== oldIsEnabled;

      // 只有在状态发生变化时才触发更新
      if (statusChanged) {
        // 创建更新后的题目对象，参照 QuestionForm.tsx 的实现
        const updatedQuestion = {
          ...question,
          isEnabled: newIsEnabled,
          // 确保所有必要的字段都存在
          type: question.type || "single",
          subjectId: question.subjectId,
          difficulty: question.difficulty || "easy",
          tags: question.tags || [],
          question_markdown: question.question_markdown || "",
          answer_simple_markdown: question.answer_simple_markdown || "",
          answer_detail_markdown: question.answer_detail_markdown || "",
          answer_analysis_markdown: question.answer_analysis_markdown || "",
          options: question.options,
          files: question.files || {},
        };
        await onSave(updatedQuestion);
      } else {
        // 如果没有变化，直接调用onCancel
        onCancel();
      }
    } catch (error) {
      console.error("保存状态失败:", error);
      message.error("保存状态失败");
    }
  };

  if (isEditing) {
    return (
      <Form form={form} initialValues={{ isEnabled: question.isEnabled ?? true }}>
        <FormItem
          name="isEnabled"
          valuePropName="checked"
        >
          <Switch onChange={handleSave} autoFocus />
        </FormItem>
      </Form>
    );
  }

  return (
    <div style={{ cursor: "pointer" }} onClick={handleEdit}>
      <span style={{ color: question.isEnabled ? "green" : "red" }}>
        {question.isEnabled ? "启用" : "禁用"}
      </span>
    </div>
  );
};

export { StatusEditor };