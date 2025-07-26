import { useState, useEffect } from 'react';
import { useView } from '@context/viewProvider';
import { SecretBadge } from '@components/configuration/secret/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { CodePanel } from '@components/code';
import { secretTemplate } from '@templates/secret.yaml';
import { dump } from 'js-yaml';
import { SecretForm } from './_form';
import { V1Secret } from '@utils/k8s-types';
import { FieldLabel } from '@components/form/field-labels';
import { Annotation as FieldAnnotation } from '@components/form/field-annotations';

interface SecretData {
  key: string;
  value: string;
}

export const SecretsEditView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [original, setOriginal] = useState<V1Secret | null>(null);
  
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>('');
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [type, setType] = useState<string>('Opaque');
  const [data, setData] = useState<SecretData[]>([{ key: '', value: '' }]);
  const [useStringData, setUseStringData] = useState<boolean>(false);

  useEffect(() => {
    const fetchSecret = async () => {
      try {
        const secret = await window.electronAPI.readNamespacedSecret(viewContext.name, viewContext.namespace);
        setOriginal(secret);
        
        setName(secret.metadata.name || '');
        setNamespace(secret.metadata.namespace || '');
        
        const labelEntries = Object.entries(secret.metadata.labels || {});
        setLabels(labelEntries.length > 0 ? labelEntries.map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }]);
        
        const annotationEntries = Object.entries(secret.metadata.annotations || {});
        setAnnotations(annotationEntries.length > 0 ? annotationEntries.map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }]);
        
        setType(secret.type || 'Opaque');
        
        if (secret.stringData && Object.keys(secret.stringData).length > 0) {
          setUseStringData(true);
          const dataEntries = Object.entries(secret.stringData);
          setData(dataEntries.map(([key, value]) => ({ key, value })));
        } else if (secret.data) {
          setUseStringData(false);
          const dataEntries = Object.entries(secret.data);
          setData(dataEntries.map(([key, value]) => ({ 
            key, 
            value: atob(value)
          })));
        } else {
          setData([{ key: '', value: '' }]);
        }
        
        setLoading(false);
      } catch (e) {
        console.error("Failed to fetch secret:", e);
        setError("Failed to fetch secret for editing.");
        setLoading(false);
      }
    };

    fetchSecret();
  }, [viewContext.name, viewContext.namespace]);

  const payload = secretTemplate({
    name,
    namespace,
    labels,
    annotations,
    type: type as any,
    data: useStringData ? [] : data,
    stringData: useStringData ? data : undefined
  });

  const handleUpdate = async () => {
    try {
      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.Secrets,
          action: ResourceAction.Details,
          name: name,
          namespace: namespace
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to update secret.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.Secrets,
      action: ResourceAction.Details,
      name: viewContext.name,
      namespace: viewContext.namespace
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CreateHeader 
        error={error}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
            <Button variant="primary" onClick={() => handleUpdate()}>Update</Button>
          </div>
        }
      >
        <SecretBadge />Edit Secret: {name}
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
          isEdit={true}
        />

        <div className='px-4'>
          <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>
        </div>
      </div>
    </>
  );
};