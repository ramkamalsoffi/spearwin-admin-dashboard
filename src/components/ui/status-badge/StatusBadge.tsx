import React from "react";

type StatusType = "active" | "inactive" | "pending" | "completed" | "cancelled";

interface StatusBadgeProps {
  status: StatusType;
  size?: "sm" | "md";
  className?: string;
  customLabel?: string; // Allow custom label text
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = "md", 
  className = "",
  customLabel 
}) => {
  const statusConfig = {
    active: {
      label: "Active",
      classes: "bg-green-100 text-green-800"
    },
    inactive: {
      label: "Inactive", 
      classes: "bg-red-100 text-red-800"
    },
    pending: {
      label: "Pending",
      classes: "bg-orange-100 text-orange-800"
    },
    completed: {
      label: "Completed",
      classes: "bg-blue-100 text-blue-800"
    },
    cancelled: {
      label: "Cancelled",
      classes: "bg-gray-100 text-gray-800"
    }
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1 text-sm"
  };

  const config = statusConfig[status];
  const displayLabel = customLabel || config.label;
  
  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium ${config.classes} ${sizeClasses[size]} ${className}`}
    >
      {displayLabel}
    </span>
  );
};

export default StatusBadge;
