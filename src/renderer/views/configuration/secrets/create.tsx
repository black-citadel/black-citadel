import { useState } from 'react';
import { useView } from '@context/viewProvider'
import { SecretBadge } from '@components/configuration/secret/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@components/base/button';
import { ResourceAction, Resources } from '@utils/enums';
import { Description, Field, Label } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Dropdown, DropdownOption } from '@components/base/dropdown';
import { Textarea } from '@components/base/textarea';
import { Subheading } from '@components/base/heading';
import { CodePanel } from '@components/code';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { secretTemplate } from '@templates/secret.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import { NamespaceDropdown } from '@components/namespace-dropdown';
import helpObjects from '@help/index';

interface SecretData {
  key: string;
  value: string;
}

export const SecretsCreateView = (): JSX.Element => {
  const { setViewContext, activeNamespace } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>(activeNamespace === 'all' ? 'default' : activeNamespace);
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [type, setType] = useState<string>('Opaque');
  const [data, setData] = useState<SecretData[]>([{ key: '', value: '' }]);
  const [useStringData, setUseStringData] = useState<boolean>(false);

  // Handle type-specific data
  const handleTypeChange = (newType: string) => {
    setType(newType);
    
    // Set default keys for specific types
    switch (newType) {
      case 'kubernetes.io/basic-auth':
        setData([
          { key: 'username', value: '' },
          { key: 'password', value: '' }
        ]);
        break;
      case 'kubernetes.io/ssh-auth':
        setData([{ key: 'ssh-privatekey', value: '' }]);
        break;
      case 'kubernetes.io/tls':
        setData([
          { key: 'tls.crt', value: '' },
          { key: 'tls.key', value: '' }
        ]);
        break;
      case 'kubernetes.io/dockerconfigjson':
        setData([{ key: '.dockerconfigjson', value: '' }]);
        break;
      default:
        if (data.length === 0 || (data.length === 1 && !data[0].key && !data[0].value)) {
          setData([{ key: '', value: '' }]);
        }
    }
  };

  let payload = secretTemplate({
    name,
    namespace,
    labels,
    annotations,
    type: type as any,
    data: useStringData ? [] : data,
    stringData: useStringData ? data : undefined
  });

  const handleCreate = async () => {
    try {
      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.Secrets,
          action: ResourceAction.Details,
          name: name,
          namespace: namespace
        })
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create secret.");
    }
  };

  const handleAddData = () => {
    setData([...data, { key: '', value: '' }]);
  };

  const handleRemoveData = (index: number) => {
    // Don't remove required fields for specific types
    const requiredKeys = getRequiredKeys(type);
    if (requiredKeys.includes(data[index].key)) {
      return;
    }
    setData(data.filter((_, i) => i !== index));
  };

  const handleDataChange = (index: number, field: 'key' | 'value', value: string) => {
    const newData = [...data];
    newData[index][field] = value;
    setData(newData);
  };

  const getRequiredKeys = (secretType: string): string[] => {
    switch (secretType) {
      case 'kubernetes.io/basic-auth':
        return ['username', 'password'];
      case 'kubernetes.io/ssh-auth':
        return ['ssh-privatekey'];
      case 'kubernetes.io/tls':
        return ['tls.crt', 'tls.key'];
      case 'kubernetes.io/dockerconfigjson':
        return ['.dockerconfigjson'];
      default:
        return [];
    }
  };

  const isRequiredKey = (key: string): boolean => {
    return getRequiredKeys(type).includes(key);
  };

  return (
    <>
      <CreateHeader error={error}><SecretBadge />Create a New Secret</CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <div className='px-4 space-y-6'>
          <div>
            <Subheading className='mb-4'>Metadata</Subheading>
            
            <Field>
              <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
              <Description>
                Enter a unique name for your secret.
              </Description>
              <Input 
                name="name" 
                value={name} 
                onChange={(event) => setName(event.target.value)} 
                placeholder="e.g., my-secret" 
              />
            </Field>

            <Field>
              <Label>Namespace</Label>
              <Description>
                Select the namespace for this secret.
              </Description>
              <NamespaceDropdown 
                value={namespace} 
                onChange={setNamespace}
              />
            </Field>

            <FieldLabels labels={labels} setLabels={setLabels} />
            <FieldAnnotations annotations={annotations} setAnnotations={setAnnotations} />
          </div>

          <div>
            <Subheading className='mb-4'>Secret Type</Subheading>
            
            <Field>
              <Label>Type</Label>
              <Description>
                Select the secret type. This determines the expected keys and usage.
              </Description>
              <Dropdown 
                name="type" 
                value={type} 
                onChange={(value) => handleTypeChange(value)}
                options={[
                  { value: 'Opaque', label: 'Opaque (Generic)' },
                  { value: 'kubernetes.io/service-account-token', label: 'Service Account Token' },
                  { value: 'kubernetes.io/dockercfg', label: 'Docker Config (.dockercfg)' },
                  { value: 'kubernetes.io/dockerconfigjson', label: 'Docker Config (.dockerconfigjson)' },
                  { value: 'kubernetes.io/basic-auth', label: 'Basic Authentication' },
                  { value: 'kubernetes.io/ssh-auth', label: 'SSH Authentication' },
                  { value: 'kubernetes.io/tls', label: 'TLS' },
                  { value: 'bootstrap.kubernetes.io/token', label: 'Bootstrap Token' }
                ]}
              />
            </Field>

            {type === 'Opaque' && (
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={useStringData}
                    onChange={(e) => setUseStringData(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">Use String Data (no base64 encoding)</span>
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  When checked, values will be stored as plain text. Otherwise, they'll be base64 encoded.
                </p>
              </div>
            )}
          </div>

          <div>
            <Subheading className='mb-4'>Secret Data</Subheading>
            {data.map((item, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded p-3 mb-3">
                <Field>
                  <Label>Key {isRequiredKey(item.key) && <span className="text-red-500">*</span>}</Label>
                  <Input
                    value={item.key}
                    onChange={(e) => handleDataChange(index, 'key', e.target.value)}
                    placeholder="e.g., password"
                    disabled={isRequiredKey(item.key)}
                  />
                </Field>
                <Field>
                  <Label>Value</Label>
                  <Textarea
                    value={item.value}
                    onChange={(e) => handleDataChange(index, 'value', e.target.value)}
                    placeholder={useStringData ? "Enter value" : "Enter value (will be base64 encoded)"}
                    rows={3}
                  />
                </Field>
                {!isRequiredKey(item.key) && (
                  <Button
                    color="red"
                    onClick={() => handleRemoveData(index)}
                    disabled={data.length === 1}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button color="dark/white" onClick={handleAddData}>
              Add Data Entry
            </Button>
          </div>

          {type === 'kubernetes.io/dockerconfigjson' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> For Docker config, provide a valid JSON configuration in the .dockerconfigjson field.
                Example format: {"{ \"auths\": { \"registry.example.com\": { \"auth\": \"base64-encoded-credentials\" } } }"}
              </p>
            </div>
          )}

          {type === 'kubernetes.io/tls' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> For TLS secrets, provide the certificate in tls.crt and the private key in tls.key.
              </p>
            </div>
          )}
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