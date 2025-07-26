import React from 'react';
import { Field, Label } from "@components/base/fieldset";
import { Input } from "@components/base/input";
import { V1HTTPHeader } from '@kubernetes/client-node';

interface V1HTTPHeaderFormProps {
  header: V1HTTPHeader;
  onChange: (header: V1HTTPHeader) => void;
  nameLabel?: string;
  valueLabel?: string;
}

export function V1HTTPHeaderForm({ 
  header, 
  onChange,
  nameLabel = "Header Name",
  valueLabel = "Header Value"
}: V1HTTPHeaderFormProps) {
  const handleChange = (field: 'name' | 'value', value: string) => {
    onChange({ ...header, [field]: value });
  };

  return (
    <div className="grid gap-x-4 gap-y-4 grid-cols-2">
      <Field>
        {nameLabel && <Label>{nameLabel}</Label>}
        <Input
          name="header-name"
          value={header.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g., Content-Type"
        />
      </Field>
      <Field>
        {valueLabel && <Label>{valueLabel}</Label>}
        <Input
          name="header-value"
          value={header.value || ''}
          onChange={(e) => handleChange('value', e.target.value)}
          placeholder="e.g., application/json"
        />
      </Field>
    </div>
  );
}