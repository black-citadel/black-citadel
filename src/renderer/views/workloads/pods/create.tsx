import { useState } from 'react';
import { useView } from '@context/viewProvider'
import { PodBadge } from '@components/workloads/pod/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@components/base/button';
import { ResourceAction, Resources } from '@utils/enums';
import { Description, Field, Label } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Subheading } from '@components/base/heading';
import { NamespaceSelect } from '@components/form/field-namespace-select';
import { CodePanel } from '@components/code';
import { podTemplate } from '@templates/pod.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import helpObjects from '@help/index';

export const PodsCreateView = (): JSX.Element => {
  const { setViewContext, activeNamespace } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [namespace, setNamespace] = useState<string>(activeNamespace === 'all' ? '' : activeNamespace);

  const payload = podTemplate(name, namespace, image);

  const handleCreate = async () => {
    try {
      const result = await window.electronAPI.createNamespacedPod(namespace, payload);

      if (result.success) {
        setViewContext({
          resource: Resources.Pods,
          action: ResourceAction.Details,
          name: result.data.metadata.name,
          namespace: result.data.metadata.namespace
        })
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create pod.");
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImage(event.target.value);
  };

  return (
    <>
      <CreateHeader error={error}><PodBadge />Create a New Pod</CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <div className='px-4'>
          <Subheading className='mb-4'>Metadata</Subheading>
          
          <Field>
            <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
            <Description>
              Enter a unique name for your pod. The name must be a valid DNS subdomain name.
            </Description>
            <Input name="name" value={name} onChange={handleNameChange} placeholder="e.g., my-pod" />
          </Field>

          <Field>
            <Label>Namespace <HelpButton title="Namespace" content={helpObjects.metadata.name.help} /></Label>
            <Description>
              Select the namespace where the pod will be created.
            </Description>
            <NamespaceSelect
              value={namespace}
              onChange={setNamespace}
            />
          </Field>

          <Subheading className='mt-8 mb-4'>Spec</Subheading>

          <Field>
            <Label>Image <HelpButton title="Image" content={helpObjects.pod.image.help} /></Label>
            <Description>
              Specify the Docker image to use for this pod's container.
            </Description>
            <Input name="image" value={image} onChange={handleImageChange} placeholder="e.g., nginx:latest" />
          </Field>
        </div>

        <div className='px-4'>
          <CodePanel code={dump(podTemplate(name, namespace, image))}>
            <code>{dump(podTemplate(name, namespace, image))}</code>
          </CodePanel>

          <div className="mt-4">
            <Button onClick={() => handleCreate()} color='white' className='uppercase'>Apply</Button>
          </div>
        </div>
      </div>
    </>
  );
};
