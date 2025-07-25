import { useState, useEffect } from 'react';
import { Description, Field, Label } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Subheading } from '@components/base/heading';
import { CodePanel } from '@components/code';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { namespaceTemplate } from '@templates/namespace.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import helpObjects from '@help/index';
import { V1Namespace } from '@utils/k8s-types';

interface NamespaceFormProps {
  namespace?: V1Namespace | null;
  onChange?: (payload: any) => void;
  isEdit?: boolean;
}

export const NamespaceForm = ({ 
  namespace, 
  onChange,
  isEdit = false 
}: NamespaceFormProps): JSX.Element => {
  const [name, setName] = useState<string>('');
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);

  useEffect(() => {
    if (namespace) {
      setName(namespace.metadata?.name || '');
      
      // Convert labels to array format
      if (namespace.metadata?.labels) {
        const labelArray = Object.entries(namespace.metadata.labels).map(([key, value]) => ({ key, value }));
        setLabels(labelArray.length > 0 ? labelArray : [{ key: '', value: '' }]);
      }
      
      // Convert annotations to array format, filtering out kubectl.kubernetes.io/last-applied-configuration
      if (namespace.metadata?.annotations) {
        const annotationArray = Object.entries(namespace.metadata.annotations)
          .filter(([key]) => key !== 'kubectl.kubernetes.io/last-applied-configuration')
          .map(([key, value]) => ({ key, value }));
        setAnnotations(annotationArray.length > 0 ? annotationArray : [{ key: '', value: '' }]);
      }
    }
  }, [namespace]);

  const payload = namespaceTemplate(name, labels, annotations);

  // Call onChange whenever the payload changes
  useEffect(() => {
    if (onChange) {
      onChange(payload);
    }
  }, [name, labels, annotations, onChange]);

  return (
    <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
      <div className='px-4'>
        <Subheading className='mb-4'>Metadata</Subheading>
        <Field>
          <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
          <Description>
            {isEdit 
              ? 'The namespace name cannot be changed.' 
              : 'Enter a unique name for your namespace.'}
          </Description>
          <Input 
            name="name" 
            value={name} 
            onChange={(event) => setName(event.target.value)} 
            placeholder={isEdit ? undefined : "e.g., my-namespace"}
            disabled={isEdit}
            className={isEdit ? "bg-neutral-100 dark:bg-neutral-800 cursor-not-allowed opacity-60" : undefined}
          />
        </Field>

        <FieldLabels labels={labels} setLabels={setLabels} />

        <FieldAnnotations annotations={annotations} setAnnotations={setAnnotations} />

      </div>

      <div className='px-4'>
        <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>
      </div>
    </div>
  );
};