import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { PersistentVolumeClaimBadge } from '@components/storage/persistent-volume-claim/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku-bv/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { CodePanel } from '@components/code';
import { Label as FieldLabel } from '@components/form/field-labels';
import { Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { persistentVolumeClaimTemplate } from '@templates/persistentvolumeclaim.yaml';
import { dump } from 'js-yaml';
import { PersistentVolumeClaimForm } from './_form';

export const PersistentVolumeClaimsCreateView = (): JSX.Element => {
  const { setViewContext, activeNamespace } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>(activeNamespace === 'all' ? 'default' : activeNamespace);
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [accessModes, setAccessModes] = useState<string[]>(['ReadWriteOnce']);
  const [storageClassName, setStorageClassName] = useState<string>('');
  const [storage, setStorage] = useState<string>('1Gi');
  const [volumeMode, setVolumeMode] = useState<'Filesystem' | 'Block'>('Filesystem');
  const [enableDataSource, setEnableDataSource] = useState<boolean>(false);
  const [dataSourceKind, setDataSourceKind] = useState<string>('PersistentVolumeClaim');
  const [dataSourceName, setDataSourceName] = useState<string>('');
  const [dataSourceApiGroup, setDataSourceApiGroup] = useState<string>('');
  const [enableSelector, setEnableSelector] = useState<boolean>(false);
  const [selectorMatchLabels, setSelectorMatchLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);


  const payload = persistentVolumeClaimTemplate({
    name,
    namespace,
    labels,
    annotations,
    accessModes,
    storageClassName: storageClassName || undefined,
    storage,
    volumeMode,
    dataSource: enableDataSource && dataSourceName ? {
      kind: dataSourceKind,
      name: dataSourceName,
      apiGroup: dataSourceApiGroup || undefined
    } : undefined,
    selector: enableSelector ? {
      matchLabels: selectorMatchLabels.filter(l => l.key && l.value)
    } : undefined
  });

  const handleCreate = async () => {
    try {
      if (accessModes.length === 0) {
        setError("At least one access mode must be selected.");
        return;
      }

      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.PersistentVolumeClaims,
          action: ResourceAction.Details,
          name: name,
          namespace: namespace
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create persistent volume claim.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.PersistentVolumeClaims,
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
        <PersistentVolumeClaimBadge />Create a New Persistent Volume Claim
      </CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <PersistentVolumeClaimForm
          name={name}
          setName={setName}
          namespace={namespace}
          setNamespace={setNamespace}
          labels={labels}
          setLabels={setLabels}
          annotations={annotations}
          setAnnotations={setAnnotations}
          accessModes={accessModes}
          setAccessModes={setAccessModes}
          storageClassName={storageClassName}
          setStorageClassName={setStorageClassName}
          storage={storage}
          setStorage={setStorage}
          volumeMode={volumeMode}
          setVolumeMode={setVolumeMode}
          enableDataSource={enableDataSource}
          setEnableDataSource={setEnableDataSource}
          dataSourceKind={dataSourceKind}
          setDataSourceKind={setDataSourceKind}
          dataSourceName={dataSourceName}
          setDataSourceName={setDataSourceName}
          dataSourceApiGroup={dataSourceApiGroup}
          setDataSourceApiGroup={setDataSourceApiGroup}
          enableSelector={enableSelector}
          setEnableSelector={setEnableSelector}
          selectorMatchLabels={selectorMatchLabels}
          setSelectorMatchLabels={setSelectorMatchLabels}
        />

        <div className='px-4'>
          <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>
        </div>
      </div>
    </>
  );
};