import React, { useMemo, useCallback } from "react";
import { Button, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { DifficultyEditor } from "../components/DifficultyEditor";
import { TagsEditor } from "../components/TagsEditor";
import { QuestionEditor } from "../components/QuestionEditor";
import { TypeEditor } from "../components/TypeEditor";

interface UseQuestionTableColumnsProps {
  navigate: (path: string) => void;
  editingId: string | null;
  editingTagsId: string | null;
  editingQuestionId: string | null;
  editingTypeId: string | null;
  setEditingId: (id: string | null) => void;
  setEditingTagsId: (id: string | null) => void;
  setEditingQuestionId: (id: string | null) => void;
  setEditingTypeId: (id: string | null) => void;
  handleUpdateDifficulty: (question: any, subjectId: string) => Promise<void>;
  handleUpdateTags: (question: any, subjectId: string) => Promise<void>;
  handleUpdateQuestion: (question: any, subjectId: string) => Promise<void>;
  handleUpdateType: (question: any, subjectId: string) => Promise<void>;
  handleDelete: (id: string, subjectId: string) => Promise<void>;
  activeSubjectId: string;
  getTypeDisplay: (type: string) => string;
}

// 使用 React.memo 包装渲染函数，避免不必要的重新渲染
const DifficultyColumnRenderer = React.memo(({
  record,
  editingId,
  setEditingId,
  handleUpdateDifficulty,
  activeSubjectId
}: {
  record: any;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  handleUpdateDifficulty: (question: any, subjectId: string) => Promise<void>;
  activeSubjectId: string;
}) => {
  return React.createElement(DifficultyEditor, {
    question: record,
    isEditing: editingId === record._id,
    onEdit: () => setEditingId(record._id),
    onSave: async (updatedQuestion: any) => {
      await handleUpdateDifficulty(updatedQuestion, activeSubjectId);
    },
    onCancel: () => setEditingId(null),
    activeSubjectId: activeSubjectId,
  });
});

// 使用 React.memo 包装渲染函数，避免不必要的重新渲染
const TagsColumnRenderer = React.memo(({
  record,
  editingTagsId,
  setEditingTagsId,
  handleUpdateTags,
  activeSubjectId
}: {
  record: any;
  editingTagsId: string | null;
  setEditingTagsId: (id: string | null) => void;
  handleUpdateTags: (question: any, subjectId: string) => Promise<void>;
  activeSubjectId: string;
}) => {
  return React.createElement(TagsEditor, {
    question: record,
    isEditing: editingTagsId === record._id,
    onEdit: () => setEditingTagsId(record._id),
    onSave: async (updatedQuestion: any) => {
      await handleUpdateTags(updatedQuestion, activeSubjectId);
    },
    onCancel: () => setEditingTagsId(null),
    activeSubjectId: activeSubjectId,
  });
});

// 使用 React.memo 包装渲染函数，避免不必要的重新渲染
const QuestionColumnRenderer = React.memo(({
  record,
  editingQuestionId,
  setEditingQuestionId,
  handleUpdateQuestion,
  activeSubjectId
}: {
  record: any;
  editingQuestionId: string | null;
  setEditingQuestionId: (id: string | null) => void;
  handleUpdateQuestion: (question: any, subjectId: string) => Promise<void>;
  activeSubjectId: string;
}) => {
  return React.createElement(QuestionEditor, {
    question: record,
    isEditing: editingQuestionId === record._id,
    onEdit: () => setEditingQuestionId(record._id),
    onSave: async (updatedQuestion: any) => {
      await handleUpdateQuestion(updatedQuestion, activeSubjectId);
    },
    onCancel: () => setEditingQuestionId(null),
    activeSubjectId: activeSubjectId,
  });
});

// 使用 React.memo 包装渲染函数，避免不必要的重新渲染
const TypeColumnRenderer = React.memo(({
  record,
  editingTypeId,
  setEditingTypeId,
  handleUpdateType,
  activeSubjectId,
  getTypeDisplay
}: {
  record: any;
  editingTypeId: string | null;
  setEditingTypeId: (id: string | null) => void;
  handleUpdateType: (question: any, subjectId: string) => Promise<void>;
  activeSubjectId: string;
  getTypeDisplay: (type: string) => string;
}) => {
  return React.createElement(TypeEditor, {
    question: record,
    isEditing: editingTypeId === record._id,
    onEdit: () => setEditingTypeId(record._id),
    onSave: async (updatedQuestion: any) => {
      await handleUpdateType(updatedQuestion, activeSubjectId);
    },
    onCancel: () => setEditingTypeId(null),
    activeSubjectId: activeSubjectId,
  });
});

// 使用 React.memo 包装渲染函数，避免不必要的重新渲染
const ActionColumnRenderer = React.memo(({
  record,
  navigate,
  handleDelete
}: {
  record: any;
  navigate: (path: string) => void;
  handleDelete: (id: string, subjectId: string) => Promise<void>;
}) => {
  return React.createElement(Space, { size: "middle" },
    React.createElement(Button, {
      type: "text",
      icon: React.createElement(EditOutlined),
      onClick: () => navigate(`/questions/edit/${record._id}`),
    }, "编辑"),
    React.createElement(Popconfirm, {
      title: "确定要删除这个题目吗？",
      onConfirm: () => handleDelete(record._id, record.subjectId),
      okText: "是",
      cancelText: "否",
    },
      React.createElement(Button, {
        type: "text",
        danger: true,
        icon: React.createElement(DeleteOutlined),
      }, "删除")
    )
  );
});

export const useQuestionTableColumns = ({
  navigate,
  editingId,
  editingTagsId,
  editingQuestionId,
  editingTypeId,
  setEditingId,
  setEditingTagsId,
  setEditingQuestionId,
  setEditingTypeId,
  handleUpdateDifficulty,
  handleUpdateTags,
  handleUpdateQuestion,
  handleUpdateType,
  handleDelete,
  activeSubjectId,
  getTypeDisplay,
}: UseQuestionTableColumnsProps) => {
  // 使用 useCallback 包装函数，避免不必要的重新创建
  const handleTypeRender = useCallback((type: string) => getTypeDisplay(type), [getTypeDisplay]);

  // 使用 useCallback 包装函数，避免不必要的重新创建
  const handleDifficultyRender = useCallback((_: string, record: any) =>
    React.createElement(DifficultyColumnRenderer, {
      record: record,
      editingId: editingId,
      setEditingId: setEditingId,
      handleUpdateDifficulty: handleUpdateDifficulty,
      activeSubjectId: activeSubjectId,
    })
    , [editingId, setEditingId, handleUpdateDifficulty, activeSubjectId]);

  // 使用 useCallback 包装函数，避免不必要的重新创建
  const handleTagsRender = useCallback((_: string[], record: any) =>
    React.createElement(TagsColumnRenderer, {
      record: record,
      editingTagsId: editingTagsId,
      setEditingTagsId: setEditingTagsId,
      handleUpdateTags: handleUpdateTags,
      activeSubjectId: activeSubjectId,
    })
    , [editingTagsId, setEditingTagsId, handleUpdateTags, activeSubjectId]);

  // 使用 useCallback 包装函数，避免不必要的重新创建
  const handleQuestionRender = useCallback((_: string, record: any) =>
    React.createElement(QuestionColumnRenderer, {
      record: record,
      editingQuestionId: editingQuestionId,
      setEditingQuestionId: setEditingQuestionId,
      handleUpdateQuestion: handleUpdateQuestion,
      activeSubjectId: activeSubjectId,
    })
    , [editingQuestionId, setEditingQuestionId, handleUpdateQuestion, activeSubjectId]);

  // 使用 useCallback 包装函数，避免不必要的重新创建
  const handleTypeColumnRender = useCallback((_: string, record: any) =>
    React.createElement(TypeColumnRenderer, {
      record: record,
      editingTypeId: editingTypeId,
      setEditingTypeId: setEditingTypeId,
      handleUpdateType: handleUpdateType,
      activeSubjectId: activeSubjectId,
      getTypeDisplay: getTypeDisplay,
    })
    , [editingTypeId, setEditingTypeId, handleUpdateType, activeSubjectId, getTypeDisplay]);

  // 使用 useCallback 包装函数，避免不必要的重新创建
  const handleActionRender = useCallback((_: any, record: any) =>
    React.createElement(ActionColumnRenderer, {
      record: record,
      navigate: navigate,
      handleDelete: handleDelete,
    })
    , [navigate, handleDelete]);

  // 使用 useMemo 缓存列配置，避免不必要的重新计算
  return useMemo(() => [
    {
      title: "题目",
      dataIndex: "question_markdown",
      key: "question_markdown",
      ellipsis: true,
      width: "30%",
      render: handleQuestionRender,
    },
    {
      title: "类型",
      dataIndex: "type",
      key: "type",
      render: handleTypeColumnRender,
    },
    {
      title: "难度",
      dataIndex: "difficulty",
      key: "difficulty",
      render: handleDifficultyRender,
    },
    {
      title: "标签",
      dataIndex: "tags",
      key: "tags",
      render: handleTagsRender,
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "操作",
      key: "action",
      render: handleActionRender,
    },
  ], [
    handleQuestionRender,
    handleTypeColumnRender,
    handleTypeRender,
    handleDifficultyRender,
    handleTagsRender,
    handleActionRender,
  ]);
};