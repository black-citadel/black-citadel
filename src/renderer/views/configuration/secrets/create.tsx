import { useState } from 'react';
import { useView } from '@context/viewProvider'
import { SecretBadge } from '@components/configuration/secret/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { CodePanel } from '@components/code';
import { secretTemplate } from '@templates/secret.yaml';
import { dump } from 'js-yaml';
import { SecretForm } from './_form';
import { FieldLabel } from '@components/form/field-labels';
import { FieldAnnotation } from '@components/form/field-annotations';

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

  const payload = secretTemplate({
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

  const handleCancel = () => {
    setViewContext({
      resource: Resources.Secrets,
      action: ResourceAction.List
    });
  };

  return (
    <>
      <CreateHeader 
        error={error}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
            <Button variant="primary" onClick={() => handleCreate()}>Apply</Button>
          </div>
        }
      >
        <SecretBadge />Create a New Secret
      </CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <SecretForm
          name={name}
          setName={setName}
          namespace={namespace}
          setNamespace={setNamespace}
          labels={labels}
          setLabels={setLabels}
          annotations={annotations}
          setAnnotations={setAnnotations}
          type={type}
          setType={setType}
          data={data}
          setData={setData}
          useStringData={useStringData}
          setUseStringData={setUseStringData}
        />

        <div className='px-4'>
          <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>
        </div>
      </div>
    </>
  );
};