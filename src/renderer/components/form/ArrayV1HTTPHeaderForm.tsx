import React from 'react';
import { Description, Field, Label } from "@components/base/fieldset";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Button } from '@protoku/design-system';
import { V1HTTPHeader } from '@kubernetes/client-node';
import { V1HTTPHeaderForm } from './V1HTTPHeaderForm';

interface ArrayV1HTTPHeaderFormProps {
  headers: V1HTTPHeader[];
  onChange: (headers: V1HTTPHeader[]) => void;
  label?: string;
  description?: string;
}

export function ArrayV1HTTPHeaderForm({ 
  headers, 
  onChange,
  label = "HTTP Headers",
  description = "Custom headers to be sent with HTTP requests"
}: ArrayV1HTTPHeaderFormProps) {
  const handleHeaderChange = (index: number, updatedHeader: V1HTTPHeader) => {
    const newHeaders = [...headers];
    newHeaders[index] = updatedHeader;
    onChange(newHeaders);
  };

  const handleAddHeader = () => {
    onChange([...headers, { name: '', value: '' }]);
  };

  const handleRemoveHeader = (index: number) => {
    const newHeaders = headers.filter((_, i) => i !== index);
    // Always keep at least one empty entry
    onChange(newHeaders.length === 0 ? [{ name: '', value: '' }] : newHeaders);
  };

  // Ensure at least one header exists
  const displayHeaders = headers.length === 0 ? [{ name: '', value: '' }] : headers;

  return (
    <>
      <Field className="my-8">
        <Label>{label}</Label>
        <Description>{description}</Description>
        {displayHeaders.map((header, index) => (
          <div key={index} className="flex gap-4 my-4 items-start">
            <div className="flex-1 grid gap-4">
              <V1HTTPHeaderForm
                header={header}
                onChange={(updatedHeader) => handleHeaderChange(index, updatedHeader)}
                nameLabel=""
                valueLabel=""
              />
            </div>
            <div className="pt-2">
              <button 
                type="button"
                onClick={() => handleRemoveHeader(index)} 
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors rounded"
                disabled={displayHeaders.length === 1 && header.name === '' && header.value === ''}
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </Field>
      <Button onClick={handleAddHeader} variant="secondary">
        Add another header
      </Button>
    </>
  );
}