import React from "react";
import { Form, Select, Tag, message } from "antd";
import { Question } from "../../../api/types";

const { Option } = Select;
const FormItem = Form.Item;

interface DifficultyEditorProps {
  question: Question;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updatedQuestion: Question) => Promise<void>;
  onCancel: () => void;
  activeSubjectId: string;
}

const DifficultyEditor: React.FC<DifficultyEditorProps> = ({
  question,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  activeSubjectId,
}) => {
  const [form] = Form.useForm();

  // 格式化难度标签
  const getDifficultyTag = (difficulty: string) => {
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

  // 处理编辑
  const handleEdit = () => {
    onEdit();
    form.setFieldsValue({
      difficulty: question.difficulty,
    });
  };

  // 保存修改
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const newDifficulty = values.difficulty;
      const oldDifficulty = question.difficulty;

      // 检查难度是否实际发生了变化
      const difficultyChanged = newDifficulty !== oldDifficulty;

      // 只有在难度发生变化时才触发更新
      if (difficultyChanged) {
        // 创建更新后的题目对象，参照 QuestionForm.tsx 的实现
        const updatedQuestion = {
          ...question,
          difficulty: newDifficulty,
          // 确保所有必要的字段都存在
          type: question.type || "single",
          subjectId: question.subjectId,
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
      console.error("保存难度失败:", error);
      message.error("保存难度失败");
    }
  };

  if (isEditing) {
    return (
      <Form form={form} initialValues={{ difficulty: question.difficulty }}>
        <FormItem
          name="difficulty"
          rules={[{ required: true, message: "请选择难度" }]}
        >
          <Select style={{ width: 100 }} onBlur={handleSave} autoFocus>
            <Option value="easy">简单</Option>
            <Option value="medium">中等</Option>
            <Option value="hard">困难</Option>
          </Select>
        </FormItem>
      </Form>
    );
  }

  return (
    <div style={{ cursor: "pointer" }} onClick={handleEdit}>
      {getDifficultyTag(question.difficulty)}
    </div>
  );
};

export { DifficultyEditor };
