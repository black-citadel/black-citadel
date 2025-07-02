import React from 'react';
import { Listbox, ListboxLabel, ListboxOption } from './listbox';

export interface DropdownOption<T = string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface DropdownProps<T = string> {
  value: T;
  onChange: (value: T) => void;
  options: DropdownOption<T>[];
  placeholder?: string;
  name?: string;
  disabled?: boolean;
  className?: string;
}

export function Dropdown<T = string>({
  value,
  onChange,
  options,
  placeholder,
  name,
  disabled,
  className
}: DropdownProps<T>) {
  return (
    <Listbox
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={className}
    >
      {options.map((option) => (
        <ListboxOption key={String(option.value)} value={option.value}>
          <ListboxLabel>
            {option.icon && <span className="mr-2">{option.icon}</span>}
            {option.label}
          </ListboxLabel>
        </ListboxOption>
      ))}
    </Listbox>
  );
}