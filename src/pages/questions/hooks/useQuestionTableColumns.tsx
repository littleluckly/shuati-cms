import React, { useMemo, useCallback } from "react";
import { Button, Space, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { DifficultyEditor } from "../components/DifficultyEditor";
import { TagsEditor } from "../components/TagsEditor";
import { QuestionEditor } from "../components/QuestionEditor";
import { TypeEditor } from "../components/TypeEditor";
import { StatusEditor } from "../components/StatusEditor";

interface UseQuestionTableColumnsProps {
  navigate: (path: string) => void;
  editingId: string | null;
  editingTagsId: string | null;
  editingQuestionId: string | null;
  editingTypeId: string | null;
  editingStatusId: string | null;
  setEditingId: (id: string | null) => void;
  setEditingTagsId: (id: string | null) => void;
  setEditingQuestionId: (id: string | null) => void;
  setEditingTypeId: (id: string | null) => void;
  setEditingStatusId: (id: string | null) => void;
  handleUpdateDifficulty: (question: any, subjectId: string) => Promise<void>;
  handleUpdateTags: (question: any, subjectId: string) => Promise<void>;
  handleUpdateQuestion: (question: any, subjectId: string) => Promise<void>;
  handleUpdateType: (question: any, subjectId: string) => Promise<void>;
  handleUpdateStatus: (question: any, subjectId: string) => Promise<void>;
  handleDelete: (id: string, subjectId: string) => Promise<void>;
  activeSubjectId: string;
  getTypeDisplay: (type: string) => string;
  // 批量编辑相关参数
  isBatchEditing: boolean;
  batchEditingIds: Set<string>;
}

// 使用 React.memo 包装渲染函数，避免不必要的重新渲染
const DifficultyColumnRenderer = React.memo(
  ({
    record,
    editingId,
    setEditingId,
    handleUpdateDifficulty,
    activeSubjectId,
    isBatchEditing,
    batchEditingIds,
  }: {
    record: any;
    editingId: string | null;
    setEditingId: (id: string | null) => void;
    handleUpdateDifficulty: (question: any, subjectId: string) => Promise<void>;
    activeSubjectId: string;
    isBatchEditing: boolean;
    batchEditingIds: Set<string>;
  }) => {
    // 在批量编辑模式下，如果当前记录在批量编辑集合中，则显示编辑器
    const isEditing = isBatchEditing
      ? batchEditingIds.has(record._id)
      : editingId === record._id;

    return React.createElement(DifficultyEditor, {
      question: record,
      isEditing: isEditing,
      onEdit: () => setEditingId(record._id),
      onSave: async (updatedQuestion: any) => {
        await handleUpdateDifficulty(updatedQuestion, activeSubjectId);
      },
      onCancel: () => setEditingId(null),
      activeSubjectId: activeSubjectId,
    });
  }
);

// 使用 React.memo 包装渲染函数，避免不必要的重新渲染
const TagsColumnRenderer = React.memo(
  ({
    record,
    editingTagsId,
    setEditingTagsId,
    handleUpdateTags,
    activeSubjectId,
    isBatchEditing,
    batchEditingIds,
  }: {
    record: any;
    editingTagsId: string | null;
    setEditingTagsId: (id: string | null) => void;
    handleUpdateTags: (question: any, subjectId: string) => Promise<void>;
    activeSubjectId: string;
    isBatchEditing: boolean;
    batchEditingIds: Set<string>;
  }) => {
    // 在批量编辑模式下，如果当前记录在批量编辑集合中，则显示编辑器
    const isEditing = isBatchEditing
      ? batchEditingIds.has(record._id)
      : editingTagsId === record._id;

    return React.createElement(TagsEditor, {
      question: record,
      isEditing: isEditing,
      onEdit: () => setEditingTagsId(record._id),
      onSave: async (updatedQuestion: any) => {
        await handleUpdateTags(updatedQuestion, activeSubjectId);
      },
      onCancel: () => setEditingTagsId(null),
      activeSubjectId: activeSubjectId,
    });
  }
);

// 使用 React.memo 包装渲染函数，避免不必要的重新渲染
const QuestionColumnRenderer = React.memo(
  ({
    record,
    editingQuestionId,
    setEditingQuestionId,
    handleUpdateQuestion,
    activeSubjectId,
    isBatchEditing,
    batchEditingIds,
  }: {
    record: any;
    editingQuestionId: string | null;
    setEditingQuestionId: (id: string | null) => void;
    handleUpdateQuestion: (question: any, subjectId: string) => Promise<void>;
    activeSubjectId: string;
    isBatchEditing: boolean;
    batchEditingIds: Set<string>;
  }) => {
    // 在批量编辑模式下，如果当前记录在批量编辑集合中，则显示编辑器
    const isEditing = isBatchEditing
      ? batchEditingIds.has(record._id)
      : editingQuestionId === record._id;

    return React.createElement(QuestionEditor, {
      question: record,
      isEditing: isEditing,
      onEdit: () => setEditingQuestionId(record._id),
      onSave: async (updatedQuestion: any) => {
        await handleUpdateQuestion(updatedQuestion, activeSubjectId);
      },
      onCancel: () => setEditingQuestionId(null),
      activeSubjectId: activeSubjectId,
    });
  }
);

// 使用 React.memo 包装渲染函数，避免不必要的重新渲染
const TypeColumnRenderer = React.memo(
  ({
    record,
    editingTypeId,
    setEditingTypeId,
    handleUpdateType,
    activeSubjectId,
    getTypeDisplay,
    isBatchEditing,
    batchEditingIds,
  }: {
    record: any;
    editingTypeId: string | null;
    setEditingTypeId: (id: string | null) => void;
    handleUpdateType: (question: any, subjectId: string) => Promise<void>;
    activeSubjectId: string;
    getTypeDisplay: (type: string) => string;
    isBatchEditing: boolean;
    batchEditingIds: Set<string>;
  }) => {
    // 在批量编辑模式下，如果当前记录在批量编辑集合中，则显示编辑器
    const isEditing = isBatchEditing
      ? batchEditingIds.has(record._id)
      : editingTypeId === record._id;

    return React.createElement(TypeEditor, {
      question: record,
      isEditing: isEditing,
      onEdit: () => setEditingTypeId(record._id),
      onSave: async (updatedQuestion: any) => {
        await handleUpdateType(updatedQuestion, activeSubjectId);
      },
      onCancel: () => setEditingTypeId(null),
      activeSubjectId: activeSubjectId,
    });
  }
);

// 使用 React.memo 包装渲染函数，避免不必要的重新渲染
const StatusColumnRenderer = React.memo(
  ({
    record,
    editingStatusId,
    setEditingStatusId,
    handleUpdateStatus,
    activeSubjectId,
    isBatchEditing,
    batchEditingIds,
  }: {
    record: any;
    editingStatusId: string | null;
    setEditingStatusId: (id: string | null) => void;
    handleUpdateStatus: (question: any, subjectId: string) => Promise<void>;
    activeSubjectId: string;
    isBatchEditing: boolean;
    batchEditingIds: Set<string>;
  }) => {
    // 在批量编辑模式下，如果当前记录在批量编辑集合中，则显示编辑器
    const isEditing = isBatchEditing
      ? batchEditingIds.has(record._id)
      : editingStatusId === record._id;

    return React.createElement(StatusEditor, {
      question: record,
      isEditing: isEditing,
      onEdit: () => setEditingStatusId(record._id),
      onSave: async (updatedQuestion: any) => {
        await handleUpdateStatus(updatedQuestion, activeSubjectId);
      },
      onCancel: () => setEditingStatusId(null),
      activeSubjectId: activeSubjectId,
    });
  }
);

// 使用 React.memo 包装渲染函数，避免不必要的重新渲染
const ActionColumnRenderer = React.memo(
  ({
    record,
    navigate,
    handleDelete,
  }: {
    record: any;
    navigate: (path: string) => void;
    handleDelete: (id: string, subjectId: string) => Promise<void>;
  }) => {
    return React.createElement(
      Space,
      { size: "middle" },
      React.createElement(
        Button,
        {
          type: "text",
          icon: React.createElement(EditOutlined),
          onClick: () => navigate(`/questions/edit/${record._id}`),
        },
        "编辑"
      ),
      React.createElement(
        Popconfirm,
        {
          title: "确定要删除这个题目吗？",
          onConfirm: () => handleDelete(record._id, record.subjectId),
          okText: "是",
          cancelText: "否",
        },
        React.createElement(
          Button,
          {
            type: "text",
            danger: true,
            icon: React.createElement(DeleteOutlined),
          },
          "删除"
        )
      )
    );
  }
);

export const useQuestionTableColumns = ({
  navigate,
  editingId,
  editingTagsId,
  editingQuestionId,
  editingTypeId,
  editingStatusId,
  setEditingId,
  setEditingTagsId,
  setEditingQuestionId,
  setEditingTypeId,
  setEditingStatusId,
  handleUpdateDifficulty,
  handleUpdateTags,
  handleUpdateQuestion,
  handleUpdateType,
  handleUpdateStatus,
  handleDelete,
  activeSubjectId,
  getTypeDisplay,
  // 批量编辑相关参数
  isBatchEditing,
  batchEditingIds,
}: UseQuestionTableColumnsProps) => {
  // 使用 useCallback 包装函数，避免不必要的重新创建
  const handleTypeRender = useCallback(
    (type: string) => getTypeDisplay(type),
    [getTypeDisplay]
  );

  // 使用 useCallback 包装函数，避免不必要的重新创建
  const handleDifficultyRender = useCallback(
    (_: string, record: any) =>
      React.createElement(DifficultyColumnRenderer, {
        record: record,
        editingId: editingId,
        setEditingId: setEditingId,
        handleUpdateDifficulty: handleUpdateDifficulty,
        activeSubjectId: activeSubjectId,
        isBatchEditing: isBatchEditing,
        batchEditingIds: batchEditingIds,
      }),
    [
      editingId,
      setEditingId,
      handleUpdateDifficulty,
      activeSubjectId,
      isBatchEditing,
      batchEditingIds,
    ]
  );

  // 使用 useCallback 包装函数，避免不必要的重新创建
  const handleTagsRender = useCallback(
    (_: string[], record: any) =>
      React.createElement(TagsColumnRenderer, {
        record: record,
        editingTagsId: editingTagsId,
        setEditingTagsId: setEditingTagsId,
        handleUpdateTags: handleUpdateTags,
        activeSubjectId: activeSubjectId,
        isBatchEditing: isBatchEditing,
        batchEditingIds: batchEditingIds,
      }),
    [
      editingTagsId,
      setEditingTagsId,
      handleUpdateTags,
      activeSubjectId,
      isBatchEditing,
      batchEditingIds,
    ]
  );

  // 使用 useCallback 包装函数，避免不必要的重新创建
  const handleQuestionRender = useCallback(
    (_: string, record: any) =>
      React.createElement(QuestionColumnRenderer, {
        record: record,
        editingQuestionId: editingQuestionId,
        setEditingQuestionId: setEditingQuestionId,
        handleUpdateQuestion: handleUpdateQuestion,
        activeSubjectId: activeSubjectId,
        isBatchEditing: isBatchEditing,
        batchEditingIds: batchEditingIds,
      }),
    [
      editingQuestionId,
      setEditingQuestionId,
      handleUpdateQuestion,
      activeSubjectId,
      isBatchEditing,
      batchEditingIds,
    ]
  );

  // 使用 useCallback 包装函数，避免不必要的重新创建
  const handleTypeColumnRender = useCallback(
    (_: string, record: any) =>
      React.createElement(TypeColumnRenderer, {
        record: record,
        editingTypeId: editingTypeId,
        setEditingTypeId: setEditingTypeId,
        handleUpdateType: handleUpdateType,
        activeSubjectId: activeSubjectId,
        getTypeDisplay: getTypeDisplay,
        isBatchEditing: isBatchEditing,
        batchEditingIds: batchEditingIds,
      }),
    [
      editingTypeId,
      setEditingTypeId,
      handleUpdateType,
      activeSubjectId,
      getTypeDisplay,
      isBatchEditing,
      batchEditingIds,
    ]
  );

  // 使用 useCallback 包装函数，避免不必要的重新创建
  const handleStatusRender = useCallback(
    (_: boolean, record: any) =>
      React.createElement(StatusColumnRenderer, {
        record: record,
        editingStatusId: editingStatusId,
        setEditingStatusId: setEditingStatusId,
        handleUpdateStatus: handleUpdateStatus,
        activeSubjectId: activeSubjectId,
        isBatchEditing: isBatchEditing,
        batchEditingIds: batchEditingIds,
      }),
    [
      editingStatusId,
      setEditingStatusId,
      handleUpdateStatus,
      activeSubjectId,
      isBatchEditing,
      batchEditingIds,
    ]
  );

  // 使用 useCallback 包装函数，避免不必要的重新创建
  const handleActionRender = useCallback(
    (_: any, record: any) =>
      React.createElement(ActionColumnRenderer, {
        record: record,
        navigate: navigate,
        handleDelete: handleDelete,
      }),
    [navigate, handleDelete]
  );

  // 使用 useMemo 缓存列配置，避免不必要的重新计算
  return useMemo(
    () => [
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
        title: "状态",
        dataIndex: "isEnabled",
        key: "isEnabled",
        render: handleStatusRender,
      },
      {
        title: "创建时间",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (_, { createdAt }) => {
          if (!createdAt) return "-";
          return dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss");
        },
      },
      {
        title: "更新时间",
        dataIndex: "updatedAt",
        key: "updatedAt",
        render: (_, { updatedAt }) => {
          if (!updatedAt) return "-";
          return dayjs(updatedAt).format("YYYY-MM-DD HH:mm:ss");
        },
      },
      {
        title: "操作",
        key: "action",
        fixed:'right',
        render: handleActionRender,
      },
    ],
    [
      handleQuestionRender,
      handleTypeColumnRender,
      handleTypeRender,
      handleDifficultyRender,
      handleTagsRender,
      handleStatusRender,
      handleActionRender,
    ]
  );
};
