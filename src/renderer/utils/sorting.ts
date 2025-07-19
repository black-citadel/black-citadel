import type { SortConfig } from '@protoku/design-system';

export const compareValues = (a: any, b: any, direction: 'asc' | 'desc'): number => {
  // Handle null/undefined values
  if (a === null || a === undefined) return direction === 'asc' ? 1 : -1;
  if (b === null || b === undefined) return direction === 'asc' ? -1 : 1;
  
  // Extract text content from React elements if present
  const aValue = typeof a === 'object' && a.props?.children 
    ? String(a.props.children) 
    : String(a);
  const bValue = typeof b === 'object' && b.props?.children 
    ? String(b.props.children) 
    : String(b);
  
  // Try to parse as numbers
  const aNum = parseFloat(aValue);
  const bNum = parseFloat(bValue);
  
  // If both are valid numbers, compare numerically
  if (!isNaN(aNum) && !isNaN(bNum)) {
    return direction === 'asc' ? aNum - bNum : bNum - aNum;
  }
  
  // Otherwise, compare as strings
  return direction === 'asc' 
    ? aValue.toLowerCase().localeCompare(bValue.toLowerCase())
    : bValue.toLowerCase().localeCompare(aValue.toLowerCase());
};

export const sortRows = <T extends { [key: string]: any }>(
  rows: T[],
  sortConfig: SortConfig | undefined
): T[] => {
  if (!sortConfig || !sortConfig.direction) {
    return rows;
  }
  
  return [...rows].sort((a, b) => {
    const aValue = a[sortConfig.column];
    const bValue = b[sortConfig.column];
    
    return compareValues(aValue, bValue, sortConfig.direction!);
  });
};