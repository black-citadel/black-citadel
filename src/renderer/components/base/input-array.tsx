import React from 'react';
import { Input } from './input';
import { TrashIcon } from "@heroicons/react/24/outline";
import { Button } from '@protoku/design-system';

interface InputArrayProps {
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  addButtonText?: string;
}

export function InputArray({ 
  values, 
  onChange, 
  placeholder = "Enter value",
  addButtonText = "Add another"
}: InputArrayProps) {
  const handleValueChange = (index: number, value: string) => {
    const newValues = [...values];
    newValues[index] = value;
    onChange(newValues);
  };

  const handleAddValue = () => {
    onChange([...values, '']);
  };

  const handleRemoveValue = (index: number) => {
    const newValues = values.filter((_, i) => i !== index);
    // Always keep at least one empty entry
    onChange(newValues.length === 0 ? [''] : newValues);
  };

  // Ensure at least one empty value exists
  const displayValues = values.length === 0 ? [''] : values;

  return (
    <>
      {displayValues.map((value, index) => (
        <div key={index} className="flex gap-4 my-2 items-center">
          <div className="flex-1">
            <Input
              name={`input-array-${index}`}
              value={value}
              onChange={(e) => handleValueChange(index, e.target.value)}
              placeholder={placeholder}
            />
          </div>
          <button 
            type="button"
            onClick={() => handleRemoveValue(index)} 
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors rounded"
            disabled={displayValues.length === 1 && value === ''}
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      ))}
      <Button onClick={handleAddValue} variant="secondary" className="mt-2">
        {addButtonText}
      </Button>
    </>
  );
}