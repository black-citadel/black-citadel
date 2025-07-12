import { useState } from 'react';
import { useView } from '@context/viewProvider'
import { NamespaceBadge } from '@components/cluster/namespace/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
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


export const NamespacesCreateView = (): JSX.Element => {
  const { setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);

  let payload = namespaceTemplate(name, labels, annotations);

  const handleCreate = async () => {
    try {
      const result = await window.electronAPI.createNamespace(payload);

      if (result.success) {
        setViewContext({
          resource: Resources.Namespaces,
          action: ResourceAction.Details,
          name: result.data.metadata.name
        })
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create namespace.");
    }
  };

  return (
    <>
      <CreateHeader error={error}><NamespaceBadge />Create a New Namespace</CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <div className='px-4'>
          <Subheading className='mb-4'>Metadata</Subheading>
          <Field>
            <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
            <Description>
              Enter a unique name for your namespace.
            </Description>
            <Input 
              name="name" 
              value={name} 
              onChange={(event) => setName(event.target.value)} 
              placeholder="e.g., my-namespace" 
            />
          </Field>

          <FieldLabels labels={labels} setLabels={setLabels} />

          <FieldAnnotations annotations={annotations} setAnnotations={setAnnotations} />

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
