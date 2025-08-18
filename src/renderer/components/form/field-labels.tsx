import React from 'react';
import { Description, Field, Label } from "@components/base/fieldset";
import { Input } from "@components/base/input";
import { TrashIcon } from "@heroicons/react/24/outline";
import { HelpButton } from '@components/help-button';
import helpObjects from '@help/index';
import { Button } from '@protoku-bv/design-system';

export interface Label {
  key: string;
  value: string;
}

// Alias for backward compatibility
export type FieldLabel = Label;

interface FieldLabelsProps {
  labels: Label[];
  setLabels: React.Dispatch<React.SetStateAction<Label[]>>;
}

export function FieldLabels({ labels, setLabels }: FieldLabelsProps) {
  const handleLabelChange = (index: number, field: 'key' | 'value', value: string) => {
    setLabels(prevLabels => 
      prevLabels.map((label, i) => 
        i === index ? { ...label, [field]: value } : label
      )
    );
  };

  const handleAddLabel = () => {
    setLabels(prevLabels => [...prevLabels, { key: '', value: '' }]);
  };

  const handleRemoveLabel = (index: number) => {
    setLabels(prevLabels => {
      const newLabels = prevLabels.filter((_, i) => i !== index);
      // Always keep at least one empty entry
      return newLabels.length === 0 ? [{ key: '', value: '' }] : newLabels;
    });
  };

  return (
    <>
      <Field className="my-8">
        <Label>
          Labels (optional)
          <HelpButton title="Labels" content={helpObjects.metadata.labels.help} />
        </Label>
        <Description>
          Add labels to help with organization and filtering.
        </Description>
        {labels.map((label, index) => (
          <div key={index} className="grid gap-x-4 gap-y-6 grid-cols-[1fr,1fr,auto] my-4 items-center">
            <div>
              <Input
                name={`label-key-${index}`}
                value={label.key}
                onChange={(e) => handleLabelChange(index, 'key', e.target.value)}
                placeholder="e.g., env"
              />
            </div>
            <div>
              <Input
                name={`label-value-${index}`}
                value={label.value}
                onChange={(e) => handleLabelChange(index, 'value', e.target.value)}
                placeholder="e.g., pre-production"
              />
            </div>
            <div>
              <button 
                type="button"
                onClick={() => handleRemoveLabel(index)} 
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                disabled={labels.length === 1 && label.key === '' && label.value === ''}
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </Field>
      <Button onClick={handleAddLabel} variant="secondary">
        Add another label
      </Button>
    </>
  );
}
