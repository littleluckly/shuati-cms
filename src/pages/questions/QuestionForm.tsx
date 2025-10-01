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
  Switch,
} from "antd";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { v4 as uuidv4 } from "uuid";
import { RouteParams } from "../../types";
import { QuestionOption } from "../../api/types";
import { useQuestion } from "../../contexts/QuestionContext";
import { useSubject } from "../../contexts/SubjectContext";
import {
  getQuestionById,
  createQuestion,
  updateQuestion,
} from "../../api/questions";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const QuestionForm = () => {
  const [form] = Form.useForm();
  const [options, setOptions] = useState<QuestionOption[]>([
    { id: uuidv4(), content: "", isCorrect: false },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditing = !!id;

  // 获取URL参数中的subjectId
  const subjectIdFromUrl = searchParams.get("subjectId");

  // 获取QuestionContext和SubjectContext中的方法
  const { fetchQuestions } = useQuestion();
  const { subjects, fetchSubjects } = useSubject();

  // 组件挂载时获取科目列表
  useEffect(() => {
    fetchSubjects();
  }, []); // 空依赖数组，确保只在组件挂载时执行一次

  // 初始化表单数据
  useEffect(() => {
    if (isEditing) {
      const loadQuestionDetail = async () => {
        try {
          setLoading(true);
          const questionDetail = await getQuestionById(id);

          // 设置表单字段值
          form.setFieldsValue({
            type: questionDetail.type,
            difficulty: questionDetail.difficulty,
            subjectId: questionDetail.subjectId,
            category: (questionDetail as any).category || "", // 类型断言，处理可能不存在的category属性
            tags: questionDetail.tags || [],
            status: (questionDetail as any).status || "草稿", // 类型断言，处理可能不存在的status属性
            isEnabled: questionDetail.isEnabled ?? true, // 默认启用
            question_markdown: questionDetail.question_markdown,
            answer_simple_markdown: questionDetail.answer_simple_markdown || "",
            answer_detail_markdown: questionDetail.answer_detail_markdown || "",
            answer_analysis_markdown:
              questionDetail.answer_analysis_markdown || "", // 使用answer_detail_markdown代替
          });

          // 设置选项
          if (questionDetail.options && questionDetail.options.length > 0) {
            setOptions(questionDetail.options);
          } else {
            // 根据题型设置默认选项
            if (
              ["single", "multiple", "judgment"].includes(questionDetail.type)
            ) {
              if (questionDetail.type === "judgment") {
                setOptions([
                  { id: uuidv4(), content: "", isCorrect: false },
                  { id: uuidv4(), content: "", isCorrect: false },
                ]);
              } else {
                setOptions([
                  { id: uuidv4(), content: "", isCorrect: false },
                  { id: uuidv4(), content: "", isCorrect: false },
                ]);
              }
            }
          }
        } catch (error) {
          console.error("获取题目详情失败:", error);
          message.error("获取题目详情失败");
        } finally {
          setLoading(false);
        }
      };

      loadQuestionDetail();
    } else {
      // 新增题目时的默认值
      setOptions([
        { id: uuidv4(), content: "", isCorrect: false },
        { id: uuidv4(), content: "", isCorrect: false },
      ]);

      // 如果有从URL传递的subjectId，设置为默认值
      if (subjectIdFromUrl) {
        form.setFieldsValue({
          subjectId: subjectIdFromUrl,
        });
      }
    }
  }, [form, id, isEditing, subjectIdFromUrl]); // 移除 fetchSubjects 依赖项

  // 添加选项
  const addOption = () => {
    setOptions([...options, { id: uuidv4(), content: "", isCorrect: false }]);
  };

  // 删除选项
  const removeOption = (optionId) => {
    if (options.length > 1) {
      setOptions(options.filter((option) => option.id !== optionId));
    } else {
      message.warning("至少保留一个选项");
    }
  };

  // 更新选项内容
  const updateOptionContent = (optionId, content) => {
    // 对于判断题，限制只有两个选项
    if (form.getFieldValue("type") === "judgment" && options.length >= 2) {
      return;
    }

    setOptions(
      options.map((option) =>
        option.id === optionId ? { ...option, content } : option
      )
    );
  };

  // 更新选项正确性
  const updateOptionCorrectness = (optionId, isCorrect) => {
    // 如果是单选题或判断题，确保只有一个正确选项
    const questionType = form.getFieldValue("type");
    if (
      (questionType === "single" || questionType === "judgment") &&
      isCorrect
    ) {
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
  const handleSubmit = async () => {
    form
      .validateFields()
      .then(async (values) => {
        // 验证选项（单选题、多选题和判断题）
        const questionType = values.type;
        if (
          questionType === "single" ||
          questionType === "multiple" ||
          questionType === "judgment"
        ) {
          const hasEmptyOption = options.some(
            (option) => !option.content.trim()
          );
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
            (questionType === "single" || questionType === "judgment") &&
            options.filter((option) => option.isCorrect).length > 1
          ) {
            message.error(
              questionType === "single"
                ? "单选题只能有一个正确选项"
                : "判断题只能有一个正确选项"
            );
            return;
          }

          // 对于判断题，确保只有两个选项
          if (questionType === "judgment" && options.length !== 2) {
            message.error("判断题必须有且仅有两个选项");
            return;
          }
        }

        // 构建提交数据
        const questionData = {
          type: values.type,
          difficulty: values.difficulty,
          subjectId: values.subjectId,
          category: values.category, // 虽然接口定义中没有，但根据API文档应该支持
          tags: values.tags || [],
          question_markdown: values.question_markdown,
          answer_simple_markdown: values.answer_simple_markdown,
          answer_detail_markdown: values.answer_detail_markdown,
          answer_analysis_markdown: values.answer_analysis_markdown,
          options: ["single", "multiple", "judgment"].includes(questionType)
            ? options
            : undefined,
          files: {},
          status: values.status, // 虽然接口定义中没有，但根据API文档应该支持
          isEnabled: values.isEnabled,
        };

        try {
          setLoading(true);
          if (isEditing) {
            // 编辑模式 - 调用更新API
            await updateQuestion(id, questionData);
            message.success("题目更新成功");
          } else {
            // 新增模式 - 调用创建API
            await createQuestion(questionData);
            message.success("题目创建成功");
          }

          // 保存成功后刷新题目列表
          await fetchQuestions({ subjectId: values.subjectId });
          navigate("/questions");
        } catch (error) {
          console.error("保存题目失败:", error);
        } finally {
          setLoading(false);
        }
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
  // 题目类型变化时处理选项
  const handleTypeChange = (type) => {
    if (type === "single") {
      // 确保至少有2个选项，且只有一个正确
      const newOptions =
        options.length >= 2
          ? [...options]
          : [...options, { id: uuidv4(), content: "", isCorrect: false }];

      const correctCount = newOptions.filter((o) => o.isCorrect).length;
      if (correctCount === 0) {
        newOptions[0].isCorrect = true;
      } else if (correctCount > 1) {
        newOptions.forEach((o, index) => {
          o.isCorrect = index === 0;
        });
      }

      setOptions(newOptions);
    } else if (type === "multiple") {
      // 确保至少有2个选项
      if (options.length < 2) {
        setOptions([
          ...options,
          { id: uuidv4(), content: "", isCorrect: false },
        ]);
      }
    } else {
      // 其他题型不需要选项
      setOptions([]);
    }
  };

  return (
    <div>
      <Title level={2} style={{ marginTop: 0 }}>
        {isEditing ? "编辑题目" : "新增题目"}
      </Title>

      <Card loading={loading}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            type: "single",
            difficulty: "easy",
            status: "草稿",
            isEnabled: true,
          }}
          disabled={loading}
        >
          <Form.Item
            name="question_markdown"
            label="题目名称"
            rules={[{ required: true, message: "请输入题目名称" }]}
          >
            <Input placeholder="请输入题目名称" maxLength={100} />
          </Form.Item>

          <Form.Item
            name="subjectId"
            label="所属科目"
            rules={[{ required: true, message: "请选择所属科目" }]}
          >
            <Select placeholder="请选择所属科目">
              {subjects.map((subject) => (
                <Option key={subject._id} value={subject._id}>
                  {subject.name}
                </Option>
              ))}
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
            name="type"
            label="题型"
            rules={[{ required: true, message: "请选择题目类型" }]}
          >
            <Select onChange={handleTypeChange}>
              <Option value="single">单选题</Option>
              <Option value="multiple">多选题</Option>
              <Option value="judgment">判断题</Option>
              <Option value="blank">填空题</Option>
              <Option value="answer">简答题</Option>
              <Option value="coding">编程题</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="difficulty"
            label="难度等级"
            rules={[{ required: true, message: "请选择难度等级" }]}
          >
            <Select>
              <Option value="easy">简单</Option>
              <Option value="medium">中等</Option>
              <Option value="hard">困难</Option>
            </Select>
          </Form.Item>

          <Form.Item name="tags" label="标签" initialValue={[]}>
            <Select mode="tags" placeholder="请输入标签，按回车确认" />
          </Form.Item>

          {/* 选项区域 - 仅单选题和多选题显示 */}
          {form.getFieldValue("type") === "single" ||
          form.getFieldValue("type") === "multiple" ||
          form.getFieldValue("type") === "judgment" ? (
            <Form.Item
              label={`${
                form.getFieldValue("type") === "single"
                  ? "单选题"
                  : form.getFieldValue("type") === "multiple"
                  ? "多选题"
                  : "判断题"
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
                    {form.getFieldValue("type") === "single" ||
                    form.getFieldValue("type") === "judgment" ? (
                      <Radio
                        checked={option.isCorrect}
                        onChange={(e) =>
                          updateOptionCorrectness(option.id, e.target.checked)
                        }
                        style={{ marginRight: 8 }}
                      >
                        {form.getFieldValue("type") === "judgment"
                          ? index === 0
                            ? "正确"
                            : "错误"
                          : String.fromCharCode(65 + index)}
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
                      value={option.content}
                      onChange={(e) =>
                        updateOptionContent(option.id, e.target.value)
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
            name="answer_simple_markdown"
            label="精简答案"
            rules={[{ required: true, message: "请输入精简答案" }]}
            getValueFromEvent={(value) => value}
          >
            <MDEditor height={200} data-color-mode="light" />
          </Form.Item>
          <Form.Item
            name="answer_detail_markdown"
            label="扩展答案"
            rules={[{ required: true, message: "请输入扩展回答" }]}
            getValueFromEvent={(value) => value}
          >
            <MDEditor height={200} data-color-mode="light" />
          </Form.Item>

          <Form.Item
            name="answer_analysis_markdown"
            label="详细解析"
            getValueFromEvent={(value) => value}
          >
            <MDEditor height={200} data-color-mode="light" />
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

          <Form.Item
            name="isEnabled"
            label="启用状态"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleSubmit} loading={loading}>
                {isEditing ? "更新题目" : "创建题目"}
              </Button>
              <Button onClick={handleCancel} disabled={loading}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default QuestionForm;
