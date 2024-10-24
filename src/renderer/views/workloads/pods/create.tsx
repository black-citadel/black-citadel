import { useState } from 'react';
import { useView } from '@context/viewProvider'
import { PodBadge } from '@components/workloads/pod/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@components/base/button';
import { ResourceAction, Resources } from '@utils/enums';
import { Description, Field, Label } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Subheading } from '@components/base/heading';

export const PodsCreateView = (): JSX.Element => {
  const { setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [image, setImage] = useState<string>('');
  const [namespace, setNamespace] = useState<string>('');

  const handleCreate = async () => {
    try {
      const result = await window.electronAPI.createNamespacedPod(namespace, {
        metadata: {
          name: name,
          namespace: namespace
        },
        spec: {
          containers: [{
            name: name,
            image: image
          }]
        }
      });

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

  const handleNamespaceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNamespace(event.target.value);
  };

  return (
    <>
      <CreateHeader error={error}><PodBadge />Create a New Pod</CreateHeader>

      <Subheading className='mt-8 mb-4'>Metadata</Subheading>

      <Field className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <div className='px-4'>
          <Label>Name</Label>
          <Description>
            Enter a unique name for your pod. The name must be a valid DNS subdomain name.
          </Description>
        </div>
        <div className='px-4'>
          <Input name="name" value={name} onChange={handleNameChange} placeholder="e.g., my-pod" />
        </div>
      </Field>

      <Field className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <div className='px-4'>
          <Label>Namespace</Label>
          <Description>
            Select the namespace where the pod will be created.
          </Description>
        </div>
        <div className='px-4'>
          <Input name="namespace" value={namespace} onChange={handleNamespaceChange} placeholder="e.g., default" />
        </div>
      </Field>

      <Subheading className='mt-8 mb-4'>Spec</Subheading>

      <Field className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <div className='px-4'>
          <Label>Image</Label>
          <Description>
            Specify the Docker image to use for this pod's container.
          </Description>
        </div>
        <div className='px-4'>
          <Input name="image" value={image} onChange={handleImageChange} placeholder="e.g., nginx:latest" />
        </div>
      </Field>

      <div className="mt-4">
        <Button onClick={() => handleCreate()} outline className='uppercase'>Create Pod</Button>
      </div>
    </>
  );
};
