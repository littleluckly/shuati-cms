import React from "react";
import { Form, Input, message } from "antd";
import { Question } from "../../../api/types";

const FormItem = Form.Item;

interface QuestionEditorProps {
  question: Question;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updatedQuestion: Question) => Promise<void>;
  onCancel: () => void;
  activeSubjectId: string;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
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
      question_markdown: question.question_markdown,
    });
  };

  // 保存修改
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const newQuestionMarkdown = values.question_markdown;
      const oldQuestionMarkdown = question.question_markdown;

      // 检查题目内容是否实际发生了变化
      const questionChanged = newQuestionMarkdown !== oldQuestionMarkdown;

      // 只有在题目内容发生变化时才触发更新
      if (questionChanged) {
        // 创建更新后的题目对象
        const updatedQuestion = {
          ...question,
          question_markdown: newQuestionMarkdown,
          // 确保所有必要的字段都存在
          type: question.type || "single",
          subjectId: question.subjectId,
          difficulty: question.difficulty,
          tags: question.tags || [],
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
      console.error("保存题目失败:", error);
      message.error("保存题目失败");
    }
  };

  if (isEditing) {
    return (
      <Form form={form} initialValues={{ question_markdown: question.question_markdown }}>
        <FormItem
          name="question_markdown"
          rules={[{ required: true, message: "请输入题目内容" }]}
        >
          <Input.TextArea 
            autoSize={{ minRows: 2, maxRows: 6 }} 
            onBlur={handleSave} 
            autoFocus 
          />
        </FormItem>
      </Form>
    );
  }

  return (
    <div style={{ cursor: "pointer" }} onClick={handleEdit}>
      {question.question_markdown}
    </div>
  );
};

export { QuestionEditor };