import React from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell
} from './base/table';

type Row = { [key: string]: React.ReactNode };
type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
  column: string;
  direction: SortDirection;
}

interface ListTableProps {
  headers: string[];
  rows: Row[];
  sortConfig?: SortConfig;
  onSort?: (config: SortConfig) => void;
}

export const ListTable: React.FC<ListTableProps> = ({
  headers,
  rows,
  sortConfig,
  onSort
}) => {
  const handleSort = (column: string) => {
    if (!onSort) return;
    
    // Cycle through sort states: null -> asc -> desc -> null
    const currentDirection = sortConfig?.column === column ? sortConfig.direction : null;
    const nextDirection = !currentDirection ? 'asc' :
                         currentDirection === 'asc' ? 'desc' : null;
    
    onSort({
      column,
      direction: nextDirection
    });
  };

  const getSortIcon = (column: string) => {
    if (!sortConfig || sortConfig.column !== column) return '↕';
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };
  return (
    <Table dense>
      <TableHead>
        <TableRow>
          {headers.map((header, index) => (
            <TableHeader
              key={index}
              onClick={() => handleSort(header)}
              className="cursor-pointer hover:bg-zinc-900 select-none"
            >
              {header}
              <span className="ml-1 text-gray-400 inline-block">
                {getSortIcon(header)}
              </span>
            </TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {headers.map((header, cellIndex) => (
              <TableCell key={cellIndex}>
                {row[header]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};