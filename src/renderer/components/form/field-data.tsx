import React from 'react';
import { Description, Field, Label } from "@components/base/fieldset";
import { Input } from "@components/base/input";
import { Textarea } from "@components/base/textarea";
import { Button } from "@components/base/button";
import { TrashIcon } from "@heroicons/react/24/outline";

export interface DataItem {
  key: string;
  value: string;
}

interface FieldDataProps {
  data: DataItem[];
  setData: React.Dispatch<React.SetStateAction<DataItem[]>>;
}

export function FieldData({ data, setData }: FieldDataProps) {
  const handleDataChange = (index: number, field: 'key' | 'value', value: string) => {
    setData(prevData => 
      prevData.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAddData = () => {
    setData(prevData => [...prevData, { key: '', value: '' }]);
  };

  const handleRemoveData = (index: number) => {
    setData(prevData => prevData.filter((_, i) => i !== index));
  };

  return (
    <>
      <Field className="my-8">
        <Label>Data (optional)</Label>
        <Description>
          Add key-value pairs for your ConfigMap data.
        </Description>
        {data.map((item, index) => (
          <div key={index} className="grid gap-x-4 gap-y-6 grid-cols-[1fr,1fr,auto] my-4 items-start">
            <div>
              <Input
                name={`data-key-${index}`}
                value={item.key}
                onChange={(e) => handleDataChange(index, 'key', e.target.value)}
                placeholder="Key"
              />
            </div>
            <div>
              <Textarea
                name={`data-value-${index}`}
                value={item.value}
                onChange={(e) => handleDataChange(index, 'value', e.target.value)}
                placeholder="Value"
                rows={3}
              />
            </div>
            <div>
              <Button 
                onClick={() => handleRemoveData(index)} 
                className="p-2 invisible"
                disabled={index === 0}
              >
                <TrashIcon className={`w-4 h-4 ${index > 0 ? 'visible' : 'invisible'}`} />
              </Button>
            </div>
          </div>
        ))}
      </Field>
      <Button onClick={handleAddData} variant="secondary" className="uppercase">
        Add another data item
      </Button>
    </>
  );
}
