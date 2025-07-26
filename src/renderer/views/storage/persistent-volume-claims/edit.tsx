import { useState, useEffect } from 'react';
import { useView } from '@context/viewProvider';
import { PersistentVolumeClaimBadge } from '@components/storage/persistent-volume-claim/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { CodePanel } from '@components/code';
import { persistentVolumeClaimTemplate } from '@templates/persistentvolumeclaim.yaml';
import { dump } from 'js-yaml';
import { PersistentVolumeClaimForm } from './_form';
import { V1PersistentVolumeClaim } from '@utils/k8s-types';
import { FieldLabel } from '@components/form/field-labels';
import { Annotation as FieldAnnotation } from '@components/form/field-annotations';

export const PersistentVolumeClaimsEditView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [original, setOriginal] = useState<V1PersistentVolumeClaim | null>(null);
  
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>('');
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

  useEffect(() => {
    const fetchPVC = async () => {
      try {
        const pvc = await window.electronAPI.readNamespacedPersistentVolumeClaim(viewContext.name, viewContext.namespace);
        setOriginal(pvc);
        
        setName(pvc.metadata.name || '');
        setNamespace(pvc.metadata.namespace || '');
        
        const labelEntries = Object.entries(pvc.metadata.labels || {});
        setLabels(labelEntries.length > 0 ? labelEntries.map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }]);
        
        const annotationEntries = Object.entries(pvc.metadata.annotations || {});
        setAnnotations(annotationEntries.length > 0 ? annotationEntries.map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }]);
        
        if (pvc.spec?.accessModes) {
          setAccessModes(pvc.spec.accessModes);
        }
        
        if (pvc.spec?.storageClassName) {
          setStorageClassName(pvc.spec.storageClassName);
        }
        
        if (pvc.spec?.resources?.requests?.storage) {
          setStorage(pvc.spec.resources.requests.storage);
        }
        
        if (pvc.spec?.volumeMode) {
          setVolumeMode(pvc.spec.volumeMode as 'Filesystem' | 'Block');
        }
        
        if (pvc.spec?.dataSource) {
          setEnableDataSource(true);
          setDataSourceKind(pvc.spec.dataSource.kind || 'PersistentVolumeClaim');
          setDataSourceName(pvc.spec.dataSource.name || '');
          setDataSourceApiGroup(pvc.spec.dataSource.apiGroup || '');
        }
        
        if (pvc.spec?.selector) {
          setEnableSelector(true);
          if (pvc.spec.selector.matchLabels) {
            const selectorLabelEntries = Object.entries(pvc.spec.selector.matchLabels);
            setSelectorMatchLabels(selectorLabelEntries.length > 0 ? selectorLabelEntries.map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }]);
          }
        }
        
        setLoading(false);
      } catch (e) {
        console.error("Failed to fetch PVC:", e);
        setError("Failed to fetch persistent volume claim for editing.");
        setLoading(false);
      }
    };

    fetchPVC();
  }, [viewContext.name, viewContext.namespace]);

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

  const handleUpdate = async () => {
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
      setError("Failed to update persistent volume claim.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.PersistentVolumeClaims,
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
        <PersistentVolumeClaimBadge />Edit Persistent Volume Claim: {name}
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
          isEdit={true}
        />

        <div className='px-4'>
          <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>
        </div>
      </div>
    </>
  );
};