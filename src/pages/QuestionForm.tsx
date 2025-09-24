import { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Typography,
  Radio,
  Space,
  message,
  Divider,
  InputNumber,
  Checkbox,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { v4 as uuidv4 } from "uuid";
import { Question, RouteParams, QuestionOption } from "../types";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// 模拟题目数据
const mockQuestions = [
  {
    id: "1",
    title: "React中useState的作用是什么？",
    type: "选择题",
    difficulty: "简单",
    category: "前端框架",
    content:
      "# React中useState的作用\n\n`useState` 是React中的一个钩子函数，用于在函数组件中添加状态管理。",
    options: [
      { id: "1", text: "用于创建类组件", isCorrect: false },
      { id: "2", text: "用于在函数组件中添加状态", isCorrect: true },
      { id: "3", text: "用于处理DOM事件", isCorrect: false },
      { id: "4", text: "用于发起网络请求", isCorrect: false },
    ],
    answer:
      "useState是React中的一个钩子函数，用于在函数组件中添加状态管理。它返回一个包含当前状态和更新状态的函数的数组。",
    explanation:
      "useState是React Hooks的一部分，允许函数组件拥有自己的状态，而无需将其转换为类组件。",
    status: "已发布",
  },
];

const QuestionForm = () => {
  const [form] = Form.useForm();
  const [answer, setAnswer] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [options, setOptions] = useState<QuestionOption[]>([
    { id: uuidv4(), text: "", isCorrect: false },
  ]);
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const isEditing = !!id;

  // 初始化表单数据
  useEffect(() => {
    if (isEditing) {
      // 实际项目中这里会从API获取数据
      const question = mockQuestions[0];
      if (question) {
        form.setFieldsValue({
          title: question.title,
          type: question.type,
          difficulty: question.difficulty,
          category: question.category,
          status: question.status,
          content: question.content,
        });
        setAnswer(question.answer);
        setExplanation(question.explanation);
        setOptions(question.options || []);
      }
    } else {
      // 新增题目时的默认值
      setOptions([
        { id: uuidv4(), text: "", isCorrect: false },
        { id: uuidv4(), text: "", isCorrect: false },
      ]);
    }
  }, [form, id, isEditing]);

  // 添加选项
  const addOption = () => {
    setOptions([...options, { id: uuidv4(), text: "", isCorrect: false }]);
  };

  // 删除选项
  const removeOption = (optionId) => {
    if (options.length > 1) {
      setOptions(options.filter((option) => option.id !== optionId));
    } else {
      message.warning("至少保留一个选项");
    }
  };

  // 更新选项文本
  const updateOptionText = (optionId, text) => {
    setOptions(
      options.map((option) =>
        option.id === optionId ? { ...option, text } : option
      )
    );
  };

  // 更新选项正确性
  const updateOptionCorrectness = (optionId, isCorrect) => {
    // 如果是单选题，确保只有一个正确选项
    const questionType = form.getFieldValue("type");
    if (questionType === "选择题" && isCorrect) {
      setOptions(
        options.map((option) =>
          option.id === optionId
            ? { ...option, isCorrect: true }
            : { ...option, isCorrect: false }
        )
      );
    } else {
      setOptions(
        options.map((option) =>
          option.id === optionId ? { ...option, isCorrect } : option
        )
      );
    }
  };

  // 表单提交处理
  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        // 验证选项（选择题和多选题）
        const questionType = values.type;
        if (questionType === "选择题" || questionType === "多选题") {
          const hasEmptyOption = options.some((option) => !option.text.trim());
          if (hasEmptyOption) {
            message.error("选项不能为空");
            return;
          }

          const hasCorrectOption = options.some((option) => option.isCorrect);
          if (!hasCorrectOption) {
            message.error("请至少选择一个正确选项");
            return;
          }

          if (
            questionType === "选择题" &&
            options.filter((option) => option.isCorrect).length > 1
          ) {
            message.error("单选题只能有一个正确选项");
            return;
          }
        }

        // 构建提交数据
        const questionData = {
          id: isEditing ? id : uuidv4(),
          ...values,
          answer,
          explanation,
          options:
            questionType === "选择题" || questionType === "多选题"
              ? options
              : [],
          createdAt: isEditing
            ? undefined
            : new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
        };

        // 实际项目中这里会调用API保存数据
        console.log("保存题目数据:", questionData);

        message.success(isEditing ? "题目更新成功" : "题目创建成功");
        navigate("/questions");
      })
      .catch((info) => {
        console.log("表单验证失败:", info);
      });
  };

  // 取消按钮处理
  const handleCancel = () => {
    navigate("/questions");
  };

  // 题目类型变化时处理选项
  const handleTypeChange = (type) => {
    if (type === "选择题") {
      // 确保至少有2个选项，且只有一个正确
      const newOptions =
        options.length >= 2
          ? [...options]
          : [...options, { id: uuidv4(), text: "", isCorrect: false }];

      const correctCount = newOptions.filter((o) => o.isCorrect).length;
      if (correctCount === 0) {
        newOptions[0].isCorrect = true;
      } else if (correctCount > 1) {
        newOptions.forEach((o, index) => {
          o.isCorrect = index === 0;
        });
      }

      setOptions(newOptions);
    } else if (type === "多选题") {
      // 确保至少有2个选项
      if (options.length < 2) {
        setOptions([...options, { id: uuidv4(), text: "", isCorrect: false }]);
      }
    } else {
      // 简答题和编程题不需要选项
      setOptions([]);
    }
  };

  return (
    <div>
      <Title level={2}>{isEditing ? "编辑题目" : "新增题目"}</Title>

      <Card>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            type: "选择题",
            difficulty: "简单",
            status: "草稿",
          }}
        >
          <Form.Item
            name="title"
            label="题目名称"
            rules={[{ required: true, message: "请输入题目名称" }]}
          >
            <Input placeholder="请输入题目名称" maxLength={100} />
          </Form.Item>

          <Form.Item
            name="type"
            label="题目类型"
            rules={[{ required: true, message: "请选择题目类型" }]}
          >
            <Select onChange={handleTypeChange}>
              <Option value="选择题">选择题</Option>
              <Option value="多选题">多选题</Option>
              <Option value="简答题">简答题</Option>
              <Option value="编程题">编程题</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="difficulty"
            label="难度等级"
            rules={[{ required: true, message: "请选择难度等级" }]}
          >
            <Select>
              <Option value="简单">简单</Option>
              <Option value="中等">中等</Option>
              <Option value="困难">困难</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="category"
            label="题目分类"
            rules={[{ required: true, message: "请输入题目分类" }]}
          >
            <Input placeholder="例如：JavaScript、算法、React等" />
          </Form.Item>

          <Form.Item
            name="content"
            label="题目内容"
            rules={[{ required: true, message: "请输入题目内容" }]}
            getValueFromEvent={(value) => value}
          >
            <MDEditor height={300} />
          </Form.Item>

          {/* 选项区域 - 仅选择题和多选题显示 */}
          {form.getFieldValue("type") === "选择题" ||
          form.getFieldValue("type") === "多选题" ? (
            <Form.Item
              label={`${
                form.getFieldValue("type") === "选择题" ? "单选题" : "多选题"
              }选项`}
            >
              <div>
                {options.map((option, index) => (
                  <div
                    key={option.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                  >
                    {form.getFieldValue("type") === "选择题" ? (
                      <Radio
                        checked={option.isCorrect}
                        onChange={(e) =>
                          updateOptionCorrectness(option.id, e.target.checked)
                        }
                        style={{ marginRight: 8 }}
                      >
                        {String.fromCharCode(65 + index)}
                      </Radio>
                    ) : (
                      <Checkbox
                        checked={option.isCorrect}
                        onChange={(e) =>
                          updateOptionCorrectness(option.id, e.target.checked)
                        }
                        style={{ marginRight: 8 }}
                      >
                        {String.fromCharCode(65 + index)}
                      </Checkbox>
                    )}
                    <Input
                      placeholder={`请输入选项${String.fromCharCode(
                        65 + index
                      )}`}
                      value={option.text}
                      onChange={(e) =>
                        updateOptionText(option.id, e.target.value)
                      }
                      style={{ flex: 1, marginRight: 8 }}
                    />
                    <Button
                      type="text"
                      danger
                      onClick={() => removeOption(option.id)}
                    >
                      删除
                    </Button>
                  </div>
                ))}
                <Button
                  type="dashed"
                  onClick={addOption}
                  style={{ width: "100%" }}
                >
                  添加选项
                </Button>
              </div>
            </Form.Item>
          ) : null}

          <Divider />

          <Form.Item
            name="answer"
            label="参考答案"
            rules={[{ required: true, message: "请输入参考答案" }]}
          >
            <MDEditor value={answer} onChange={setAnswer} height={200} />
          </Form.Item>

          <Form.Item name="explanation" label="答案解析">
            <MDEditor
              value={explanation}
              onChange={setExplanation}
              height={200}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: "请选择状态" }]}
          >
            <Radio.Group>
              <Radio.Button value="草稿">草稿</Radio.Button>
              <Radio.Button value="已发布">已发布</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleSubmit}>
                {isEditing ? "更新题目" : "创建题目"}
              </Button>
              <Button onClick={handleCancel}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default QuestionForm;
