import React from "react";

interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  editIcon?: React.ReactNode;
  deleteIcon?: React.ReactNode;
  className?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onEdit,
  onDelete,
  editIcon,
  deleteIcon,
  className = ""
}) => {
  const defaultEditIcon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );

  const defaultDeleteIcon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {onEdit && (
        <button 
          onClick={onEdit}
          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
          title="Edit"
        >
          {editIcon || defaultEditIcon}
        </button>
      )}
      {onDelete && (
        <button 
          onClick={onDelete}
          className="p-1 text-red-600 hover:text-red-800 transition-colors"
          title="Delete"
        >
          {deleteIcon || defaultDeleteIcon}
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
