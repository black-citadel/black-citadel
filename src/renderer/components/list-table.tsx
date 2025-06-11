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

interface ListTableProps {
  headers: string[];
  rows: Row[];
  sortDirection?: SortDirection;
  onSort?: (direction: SortDirection) => void;
}

export const ListTable: React.FC<ListTableProps> = ({
  headers,
  rows,
  sortDirection = null,
  onSort
}) => {
  const handleSort = () => {
    if (!onSort) return;
    
    // Cycle through sort states: null -> asc -> desc -> null
    const nextDirection = !sortDirection ? 'asc' :
                         sortDirection === 'asc' ? 'desc' : null;
    onSort(nextDirection);
  };

  const getSortIcon = () => {
    if (!sortDirection) return '↕';
    return sortDirection === 'asc' ? '↑' : '↓';
  };
  return (
    <Table dense>
      <TableHead>
        <TableRow>
          {headers.map((header, index) => (
            <TableHeader
              key={index}
              onClick={index === 0 ? handleSort : undefined}
              className={index === 0 ? 'cursor-pointer hover:bg-zinc-900 select-none' : undefined}
            >
              {header}
              {index === 0 && (
                <span className="ml-1 text-gray-400 inline-block">
                  {getSortIcon()}
                </span>
              )}
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