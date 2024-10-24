import React from 'react';
import { Description, Field, Label } from "@components/base/fieldset";
import { Input } from "@components/base/input";
import { Button } from "@components/base/button";
import { TrashIcon } from "@heroicons/react/24/outline";
import { HelpButton } from '@components/help-button';
import helpObjects from '@help/helpObjects';

export interface Annotation {
  key: string;
  value: string;
}

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
    setAnnotations(prevAnnotations => prevAnnotations.filter((_, i) => i !== index));
  };

  return (
    <>
      <Field className="my-8">

        <Label>
          Annotations (optional)
          <HelpButton title={helpObjects.metadata.annotations.title} content={helpObjects.metadata.annotations.help} />
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
              <Button 
                onClick={() => handleRemoveAnnotation(index)} 
                className="p-2 invisible"
                disabled={index === 0}
              >
                <TrashIcon className={`w-4 h-4 ${index > 0 ? 'visible' : 'invisible'}`} />
              </Button>
            </div>
          </div>
        ))}
      </Field>
      <Button onClick={handleAddAnnotation} outline className="uppercase">
        Add another annotation
      </Button>
    </>
  );
}
