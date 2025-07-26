import { useState, useEffect } from 'react';
import { useView } from '@context/viewProvider';
import { ResourceQuotaBadge } from '@components/configuration/resource-quota/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { CodePanel } from '@components/code';
import { resourceQuotaTemplate } from '@templates/resourcequota.yaml';
import { dump } from 'js-yaml';
import { ResourceQuotaForm } from './_form';
import { V1ResourceQuota } from '@utils/k8s-types';
import { FieldLabel } from '@components/form/field-labels';
import { Annotation as FieldAnnotation } from '@components/form/field-annotations';

interface HardResource {
  resource: string;
  value: string;
}

export const ResourceQuotasEditView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [original, setOriginal] = useState<V1ResourceQuota | null>(null);
  
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>('');
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [hard, setHard] = useState<HardResource[]>([{ resource: '', value: '' }]);
  const [scopes, setScopes] = useState<string[]>([]);

  useEffect(() => {
    const fetchResourceQuota = async () => {
      try {
        const resourceQuota = await window.electronAPI.readNamespacedResourceQuota(viewContext.name, viewContext.namespace);
        setOriginal(resourceQuota);
        
        setName(resourceQuota.metadata.name || '');
        setNamespace(resourceQuota.metadata.namespace || '');
        
        const labelEntries = Object.entries(resourceQuota.metadata.labels || {});
        setLabels(labelEntries.length > 0 ? labelEntries.map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }]);
        
        const annotationEntries = Object.entries(resourceQuota.metadata.annotations || {});
        setAnnotations(annotationEntries.length > 0 ? annotationEntries.map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }]);
        
        if (resourceQuota.spec?.hard) {
          const hardEntries = Object.entries(resourceQuota.spec.hard);
          setHard(hardEntries.map(([resource, value]) => ({ resource, value: value as string })));
        } else {
          setHard([{ resource: '', value: '' }]);
        }
        
        setScopes(resourceQuota.spec?.scopes || []);
        
        setLoading(false);
      } catch (e) {
        console.error("Failed to fetch resource quota:", e);
        setError("Failed to fetch resource quota for editing.");
        setLoading(false);
      }
    };

    fetchResourceQuota();
  }, [viewContext.name, viewContext.namespace]);

  const payload = resourceQuotaTemplate({
    name,
    namespace,
    labels,
    annotations,
    hard,
    scopes: scopes.length > 0 ? scopes : undefined
  });

  const handleUpdate = async () => {
    try {
      const validHard = hard.filter(h => h.resource && h.value);
      if (validHard.length === 0) {
        setError("At least one resource limit must be specified.");
        return;
      }

      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.ResourceQuotas,
          action: ResourceAction.Details,
          name: name,
          namespace: namespace
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to update resource quota.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.ResourceQuotas,
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
        <ResourceQuotaBadge />Edit Resource Quota: {name}
      </CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <ResourceQuotaForm
          name={name}
          setName={setName}
          namespace={namespace}
          setNamespace={setNamespace}
          labels={labels}
          setLabels={setLabels}
          annotations={annotations}
          setAnnotations={setAnnotations}
          hard={hard}
          setHard={setHard}
          scopes={scopes}
          setScopes={setScopes}
          isEdit={true}
        />

        <div className='px-4'>
          <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>
        </div>
      </div>
    </>
  );
};