import { useState, useEffect } from 'react';
import { V1ConfigMap } from '@utils/k8s-types';
import { Field, Label, Description } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Subheading } from '@components/base/heading';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { FieldData } from '@components/form/field-data';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import { NamespaceSelect } from '@components/form/field-namespace-select';
import helpObjects from '@help/index';
import { CodePanel } from '@components/code';

interface ConfigMapFormProps {
  configMap?: V1ConfigMap | null;
  onChange: (configMap: any) => void;
  isEdit?: boolean;
}

export const ConfigMapForm = ({ configMap, onChange, isEdit = false }: ConfigMapFormProps): JSX.Element => {
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>('default');
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [data, setData] = useState<FieldLabel[]>([{ key: '', value: '' }]);

  useEffect(() => {
    if (configMap) {
      setName(configMap.metadata?.name || '');
      setNamespace(configMap.metadata?.namespace || 'default');
      
      if (configMap.metadata?.labels) {
        setLabels(Object.entries(configMap.metadata.labels).map(([key, value]) => ({ key, value })));
      }
      
      if (configMap.metadata?.annotations) {
        setAnnotations(Object.entries(configMap.metadata.annotations).map(([key, value]) => ({ key, value })));
      }

      if (configMap.data) {
        setData(Object.entries(configMap.data).map(([key, value]) => ({ key, value })));
      }
    }
  }, [configMap]);

  const payload = {
    apiVersion: 'v1',
    kind: 'ConfigMap',
    metadata: {
      name,
      namespace,
      labels: labels.filter(l => l.key && l.value).reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {}),
      annotations: annotations.filter(a => a.key && a.value).reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {})
    },
    data: data.filter(d => d.key && d.value).reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {})
  };

  useEffect(() => {
    onChange(payload);
  }, [name, namespace, labels, annotations, data]);

  return (
    <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
      <div className='px-4'>
        <Subheading>Metadata</Subheading>
        
        <Field className="my-8">
          <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
          <Description>
            Enter a unique name for your ConfigMap.
          </Description>
          <Input 
            name="name" 
            value={name} 
            onChange={(event) => setName(event.target.value)} 
            placeholder="e.g., my-config-map"
            disabled={isEdit}
          />
        </Field>

        <Field>
          <Label>Namespace</Label>
          <Description>
            Select the namespace for this ConfigMap.
          </Description>
          <NamespaceSelect 
            value={namespace} 
            onChange={setNamespace}
            disabled={isEdit}
          />
        </Field>

        <FieldLabels labels={labels} setLabels={setLabels} />
        <FieldAnnotations annotations={annotations} setAnnotations={setAnnotations} />

        <Subheading className='mt-8'>Data</Subheading>
        <FieldData data={data} setData={setData} />
      </div>

      <div className='px-4'>
        <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>
      </div>
    </div>
  );
};