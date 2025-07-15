import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { ServiceAccountBadge } from '@components/access-control/service-account/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { Description, Field, Label } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Subheading } from '@components/base/heading';
import { CodePanel } from '@components/code';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { serviceAccountTemplate } from '@templates/serviceaccount.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import { NamespaceSelect } from '@components/form/field-namespace-select';
import helpObjects from '@help/index';

export const ServiceAccountsCreateView = (): JSX.Element => {
  const { setViewContext, activeNamespace } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>(activeNamespace === 'all' ? 'default' : activeNamespace);
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [imagePullSecrets, setImagePullSecrets] = useState<string[]>(['']);
  const [secrets, setSecrets] = useState<string[]>(['']);
  const [automountServiceAccountToken, setAutomountServiceAccountToken] = useState<boolean>(true);

  const handleAddImagePullSecret = () => {
    setImagePullSecrets([...imagePullSecrets, '']);
  };

  const handleRemoveImagePullSecret = (index: number) => {
    setImagePullSecrets(imagePullSecrets.filter((_, i) => i !== index));
  };

  const handleImagePullSecretChange = (index: number, value: string) => {
    const newSecrets = [...imagePullSecrets];
    newSecrets[index] = value;
    setImagePullSecrets(newSecrets);
  };

  const handleAddSecret = () => {
    setSecrets([...secrets, '']);
  };

  const handleRemoveSecret = (index: number) => {
    setSecrets(secrets.filter((_, i) => i !== index));
  };

  const handleSecretChange = (index: number, value: string) => {
    const newSecrets = [...secrets];
    newSecrets[index] = value;
    setSecrets(newSecrets);
  };

  const payload = serviceAccountTemplate({
    name,
    namespace,
    labels,
    annotations,
    imagePullSecrets: imagePullSecrets.filter(s => s),
    secrets: secrets.filter(s => s),
    automountServiceAccountToken
  });

  const handleCreate = async () => {
    try {
      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.ServiceAccounts,
          action: ResourceAction.Details,
          name: name,
          namespace: namespace
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create service account.");
    }
  };

  return (
    <>
      <CreateHeader error={error}><ServiceAccountBadge />Create a New Service Account</CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <div className='px-4 space-y-6'>
          <div>
            <Subheading className='mb-4'>Metadata</Subheading>
            
            <Field>
              <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
              <Description>
                Enter a unique name for your service account.
              </Description>
              <Input 
                name="name" 
                value={name} 
                onChange={(event) => setName(event.target.value)} 
                placeholder="e.g., my-service-account" 
              />
            </Field>

            <Field>
              <Label>Namespace</Label>
              <Description>
                Select the namespace for this service account.
              </Description>
              <NamespaceSelect 
                value={namespace} 
                onChange={setNamespace}
              />
            </Field>

            <FieldLabels labels={labels} setLabels={setLabels} />
            <FieldAnnotations annotations={annotations} setAnnotations={setAnnotations} />
          </div>

          <div>
            <Subheading className='mb-4'>Settings</Subheading>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={automountServiceAccountToken}
                  onChange={(e) => setAutomountServiceAccountToken(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium">Automount Service Account Token</span>
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                When enabled, pods using this service account will automatically mount the service account token.
              </p>
            </div>
          </div>

          <div>
            <Subheading className='mb-4'>Image Pull Secrets</Subheading>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Secrets used to pull images for pods using this service account.
            </p>
            {imagePullSecrets.map((secret, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  placeholder="Secret name"
                  value={secret}
                  onChange={(e) => handleImagePullSecretChange(index, e.target.value)}
                  className="flex-1"
                />
                <Button
                  color="red"
                  onClick={() => handleRemoveImagePullSecret(index)}
                  disabled={imagePullSecrets.length === 1}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button color="dark/white" onClick={handleAddImagePullSecret}>
              Add Image Pull Secret
            </Button>
          </div>

          <div>
            <Subheading className='mb-4'>Secrets</Subheading>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Additional secrets that can be used by pods using this service account.
            </p>
            {secrets.map((secret, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  placeholder="Secret name"
                  value={secret}
                  onChange={(e) => handleSecretChange(index, e.target.value)}
                  className="flex-1"
                />
                <Button
                  color="red"
                  onClick={() => handleRemoveSecret(index)}
                  disabled={secrets.length === 1}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button color="dark/white" onClick={handleAddSecret}>
              Add Secret
            </Button>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> Service accounts are used to provide an identity for processes that run in a Pod. 
              When you create a pod, if you don't specify a service account, it uses the default service account in that namespace.
            </p>
          </div>
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