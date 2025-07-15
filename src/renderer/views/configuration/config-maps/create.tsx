import { useState } from 'react';
import { useView } from '@context/viewProvider'
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
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
import { NamespaceSelect } from '@components/form/field-namespace-select';
import { HelpButton } from '@components/help-button';
import helpObjects from '@help/index';

export const ConfigMapsCreateView = (): JSX.Element => {
  const { setViewContext, activeNamespace } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>(activeNamespace === 'all' ? 'default' : activeNamespace);
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [data, setData] = useState<FieldLabel[]>([{ key: '', value: '' }]);

  const payload = configMapTemplate(name, namespace, labels, annotations, data);

  const handleCreate = async () => {
    try {
      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.ConfigMaps,
          action: ResourceAction.Details,
          name: name,
          namespace: namespace
        });
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
            <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
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

          <Field>
            <Label>Namespace</Label>
            <Description>
              Select the namespace for this ConfigMap.
            </Description>
            <NamespaceSelect 
              value={namespace} 
              onChange={setNamespace}
            />
          </Field>

          <FieldLabels labels={labels} setLabels={setLabels} />

          <FieldAnnotations annotations={annotations} setAnnotations={setAnnotations} />

          <Subheading className='mt-8'>Data</Subheading>
          <FieldData data={data} setData={setData} />

        </div>

        <div className='px-4'>
          <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>

          <div className="mt-4">
            <Button variant="primary" onClick={() => handleCreate()}>Apply</Button>
          </div>
        </div>
      </div>
    </>
  );
};
