import React from "react";
import { Form, Select, message } from "antd";
import { Question } from "../../../api/types";

const { Option } = Select;
const FormItem = Form.Item;

interface TypeEditorProps {
  question: Question;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (updatedQuestion: Question) => Promise<void>;
  onCancel: () => void;
  activeSubjectId: string;
}

const TypeEditor: React.FC<TypeEditorProps> = ({
  question,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  activeSubjectId,
}) => {
  const [form] = Form.useForm();

  // 格式化类型显示
  const getTypeDisplay = (type: string) => {
    switch (type) {
      case "single":
        return "单选题";
      case "multiple":
        return "多选题";
      case "judgment":
        return "判断题";
      case "programming":
        return "编程题";
      case "blank":
        return "填空题";
      case "answer":
        return "简答题";
      default:
        return type;
    }
  };

  // 处理编辑
  const handleEdit = () => {
    onEdit();
    form.setFieldsValue({
      type: question.type,
    });
  };

  // 保存修改
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const newType = values.type;
      const oldType = question.type;

      // 检查类型是否实际发生了变化
      const typeChanged = newType !== oldType;

      // 只有在类型发生变化时才触发更新
      if (typeChanged) {
        // 创建更新后的题目对象
        const updatedQuestion = {
          ...question,
          type: newType,
          // 确保所有必要的字段都存在
          subjectId: question.subjectId,
          difficulty: question.difficulty,
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
      console.error("保存类型失败:", error);
      message.error("保存类型失败");
    }
  };

  if (isEditing) {
    return (
      <Form form={form} initialValues={{ type: question.type }}>
        <FormItem
          name="type"
          rules={[{ required: true, message: "请选择题目类型" }]}
        >
          <Select style={{ width: 120 }} onBlur={handleSave} autoFocus>
            <Option value="single">单选题</Option>
            <Option value="multiple">多选题</Option>
            <Option value="judgment">判断题</Option>
            <Option value="programming">编程题</Option>
            <Option value="blank">填空题</Option>
            <Option value="answer">简答题</Option>
          </Select>
        </FormItem>
      </Form>
    );
  }

  return (
    <div style={{ cursor: "pointer" }} onClick={handleEdit}>
      {getTypeDisplay(question.type)}
    </div>
  );
};

export { TypeEditor };