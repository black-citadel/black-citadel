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

interface ListTableProps {
  headers: string[];
  rows: Row[];
}

export const ListTable: React.FC<ListTableProps> = ({ headers, rows }) => {
  return (
    <Table dense>
      <TableHead>
        <TableRow>
          {headers.map((header, index) => (
            <TableHeader key={index}>{header}</TableHeader>
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