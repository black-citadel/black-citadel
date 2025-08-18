import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { ResourceQuotaBadge } from '@components/configuration/resource-quota/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { CodePanel } from '@components/code';
import { resourceQuotaTemplate } from '@templates/resourcequota.yaml';
import { dump } from 'js-yaml';
import { ResourceQuotaForm } from './_form';
import { FieldLabel } from '@components/form/field-labels';
import { FieldAnnotation } from '@components/form/field-annotations';

interface HardResource {
  resource: string;
  value: string;
}

export const ResourceQuotasCreateView = (): JSX.Element => {
  const { setViewContext, activeNamespace } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>(activeNamespace === 'all' ? 'default' : activeNamespace);
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [hard, setHard] = useState<HardResource[]>([{ resource: '', value: '' }]);
  const [scopes, setScopes] = useState<string[]>([]);

  const payload = resourceQuotaTemplate({
    name,
    namespace,
    labels,
    annotations,
    hard,
    scopes: scopes.length > 0 ? scopes : undefined
  });

  const handleCreate = async () => {
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
      setError("Failed to create resource quota.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.ResourceQuotas,
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
        <ResourceQuotaBadge />Create a New Resource Quota
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
        />

        <div className='px-4'>
          <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>
        </div>
      </div>
    </>
  );
};