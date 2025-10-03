import React from "react";
import Button from "../ui/button/Button";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actionButton,
  className = ""
}) => {
  return (
    <div className={`px-30 py-4 ${className}`}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
          {actionButton && (
            <Button
              onClick={actionButton.onClick}
              startIcon={actionButton.icon}
              variant="primary"
            >
              {actionButton.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
