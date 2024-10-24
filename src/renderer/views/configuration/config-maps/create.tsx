import { useState } from 'react';
import { useView } from '@context/viewProvider'
import { CreateHeader } from '@components/create-header';
import { Button } from '@components/base/button';
import { ResourceAction, Resources } from '@utils/enums';
import { Description, Field, Label } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Subheading } from '@components/base/heading';
import { CodePanel } from '@components/code';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { dump } from 'js-yaml';
import { ConfigMapBadge } from '@components/configuration/config-map/badge';
import { configMapTemplate } from '@templates/config-map.yaml';
import { FieldData } from '@components/form/field-data';
import { FieldNamespaceSelect } from '@components/form/field-namespace-select';

export const ConfigMapsCreateView = (): JSX.Element => {
  const { setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>('default');
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [data, setData] = useState<FieldLabel[]>([{ key: '', value: '' }]);

  let payload = configMapTemplate(name, namespace, labels, annotations, data);

  const handleCreate = async () => {
    try {
      const result = await window.electronAPI.createNamespacedConfigMap(namespace, payload);

      if (result.success) {
        setViewContext({
          resource: Resources.ConfigMaps,
          action: ResourceAction.Details,
          name: result.data.metadata.name,
          namespace: result.data.metadata.namespace
        })
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create ConfigMap.");
    }
  };

  return (
    <>
      <CreateHeader error={error}><ConfigMapBadge />Create a New ConfigMap</CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <div className='px-4'>
          <Subheading>Metadata</Subheading>
          <Field className="my-8">
            <Label>Name</Label>
            <Description>
              Enter a unique name for your ConfigMap.
            </Description>
            <Input 
              name="name" 
              value={name} 
              onChange={(event) => setName(event.target.value)} 
              placeholder="e.g., my-config-map" 
            />
          </Field>

          <FieldNamespaceSelect value={namespace} onChange={setNamespace} />

          <FieldLabels labels={labels} setLabels={setLabels} />

          <FieldAnnotations annotations={annotations} setAnnotations={setAnnotations} />

          <Subheading className='mt-8'>Data</Subheading>
          <FieldData data={data} setData={setData} />

        </div>

        <div className='px-4'>
          <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>

          <div className="mt-4">
            <Button onClick={() => handleCreate()} color='white' className='uppercase'>Apply</Button>
          </div>
        </div>
      </div>
    </>
  );
};
