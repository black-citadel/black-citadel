import React from 'react';
import { Description, Field, Label } from "@components/base/fieldset";
import { Input } from "@components/base/input";
import { Button } from '@protoku/design-system';
import { TrashIcon } from "@heroicons/react/24/outline";
import { HelpButton } from '@components/help-button';
import helpObjects from '@help/index';

export interface Annotation {
  key: string;
  value: string;
}

// Alias for backward compatibility
export type FieldAnnotation = Annotation;

interface Props {
  annotations: Annotation[];
  setAnnotations: React.Dispatch<React.SetStateAction<Annotation[]>>;
}

export function FieldAnnotations({ annotations, setAnnotations }: Props) {
  const handleAnnotationChange = (index: number, field: 'key' | 'value', value: string) => {
    setAnnotations(prevAnnotations => 
      prevAnnotations.map((annotation, i) => 
        i === index ? { ...annotation, [field]: value } : annotation
      )
    );
  };

  const handleAddAnnotation = () => {
    setAnnotations(prevAnnotations => [...prevAnnotations, { key: '', value: '' }]);
  };

  const handleRemoveAnnotation = (index: number) => {
    setAnnotations(prevAnnotations => {
      const newAnnotations = prevAnnotations.filter((_, i) => i !== index);
      // Always keep at least one empty entry
      return newAnnotations.length === 0 ? [{ key: '', value: '' }] : newAnnotations;
    });
  };

  return (
    <>
      <Field className="my-8">

        <Label>
          Annotations (optional)
          <HelpButton title="Annotations" content={helpObjects.metadata.annotations.help} />
        </Label>

        <Description>
          Add annotations to provide additional metadata for the resource.
        </Description>
        {annotations.map((annotation, index) => (
          <div key={index} className="grid gap-x-4 gap-y-6 grid-cols-[1fr,1fr,auto] my-4 items-center">
            <div>
              <Input
                name={`annotation-key-${index}`}
                value={annotation.key}
                onChange={(e) => handleAnnotationChange(index, 'key', e.target.value)}
                placeholder="e.g., kubernetes.io/description"
              />
            </div>
            <div>
              <Input
                name={`annotation-value-${index}`}
                value={annotation.value}
                onChange={(e) => handleAnnotationChange(index, 'value', e.target.value)}
                placeholder="e.g., Awesome project"
              />
            </div>
            <div>
              <button 
                type="button"
                onClick={() => handleRemoveAnnotation(index)} 
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                disabled={annotations.length === 1 && annotation.key === '' && annotation.value === ''}
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </Field>
      <Button onClick={handleAddAnnotation} variant="secondary">
        Add another annotation
      </Button>
    </>
  );
}
