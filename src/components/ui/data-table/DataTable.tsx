import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "../table";
import ActionButtons from "../action-buttons/ActionButtons";
import StatusBadge from "../status-badge/StatusBadge";
import Pagination from "../pagination/Pagination";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  className?: string;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  className?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onEdit,
  onDelete,
  className = ""
}) => {
  const renderCellContent = (column: Column, row: any) => {
    const value = row[column.key];
    
    if (column.render) {
      return column.render(value, row);
    }
    
    // Auto-detect status fields and render as StatusBadge
    if (column.key.toLowerCase().includes('status') && typeof value === 'string') {
      const statusMap: { [key: string]: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled' } = {
        'Active': 'active',
        'Inactive': 'inactive', 
        'Pending': 'pending',
        'Completed': 'completed',
        'Cancelled': 'cancelled'
      };
      const statusType = statusMap[value] || 'pending';
      return <StatusBadge status={statusType} />;
    }
    
    return value;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-blue-50 border-b border-gray-200">
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.key}
                  isHeader
                  className={`px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider ${column.className || ''}`}
                >
                  {column.label}
                </TableCell>
              ))}
              {(onEdit || onDelete) && (
                <TableCell
                  isHeader
                  className="px-6 py-3 text-left text-xs font-medium text-blue-900 uppercase tracking-wider"
                >
                  Action
                </TableCell>
              )}
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-gray-200">
            {data.map((row, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={`px-6 py-4 text-sm ${column.className || ''}`}
                  >
                    {renderCellContent(column, row)}
                  </TableCell>
                ))}
                {(onEdit || onDelete) && (
                  <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <ActionButtons
                      onEdit={onEdit ? () => onEdit(row) : undefined}
                      onDelete={onDelete ? () => onDelete(row) : undefined}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {currentPage && totalPages && totalItems && itemsPerPage && onPageChange && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default DataTable;
