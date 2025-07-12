import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { PersistentVolumeClaimBadge } from '@components/storage/persistent-volume-claim/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { Description, Field, Label } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Dropdown, DropdownOption } from '@components/base/dropdown';
import { Subheading } from '@components/base/heading';
import { CodePanel } from '@components/code';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { persistentVolumeClaimTemplate } from '@templates/persistentvolumeclaim.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import { NamespaceDropdown } from '@components/namespace-dropdown';
import helpObjects from '@help/index';

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

  const handleAccessModeToggle = (mode: string) => {
    if (accessModes.includes(mode)) {
      setAccessModes(accessModes.filter(m => m !== mode));
    } else {
      setAccessModes([...accessModes, mode]);
    }
  };

  let payload = persistentVolumeClaimTemplate({
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

  return (
    <>
      <CreateHeader error={error}><PersistentVolumeClaimBadge />Create a New Persistent Volume Claim</CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <div className='px-4 space-y-6'>
          <div>
            <Subheading className='mb-4'>Metadata</Subheading>
            
            <Field>
              <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
              <Description>
                Enter a unique name for your persistent volume claim.
              </Description>
              <Input 
                name="name" 
                value={name} 
                onChange={(event) => setName(event.target.value)} 
                placeholder="e.g., my-pvc" 
              />
            </Field>

            <Field>
              <Label>Namespace</Label>
              <Description>
                Select the namespace for this persistent volume claim.
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
            <Subheading className='mb-4'>Spec</Subheading>
            
            <Field>
              <Label>Storage <span className="text-red-500">*</span></Label>
              <Description>
                Amount of storage to request (e.g., 1Gi, 10Gi, 100Gi).
              </Description>
              <Input 
                name="storage" 
                value={storage} 
                onChange={(event) => setStorage(event.target.value)} 
                placeholder="e.g., 10Gi" 
              />
            </Field>

            <Field>
              <Label>Storage Class Name</Label>
              <Description>
                Name of the StorageClass required by the claim (optional).
              </Description>
              <Input 
                name="storageClassName" 
                value={storageClassName} 
                onChange={(event) => setStorageClassName(event.target.value)} 
                placeholder="e.g., standard, fast-ssd" 
              />
            </Field>

            <Field>
              <Label>Volume Mode</Label>
              <Description>
                Defines what type of volume is required.
              </Description>
              <Dropdown 
                name="volumeMode" 
                value={volumeMode} 
                onChange={(value) => setVolumeMode(value as any)}
                options={[
                  { value: 'Filesystem', label: 'Filesystem' },
                  { value: 'Block', label: 'Block' }
                ]}
              />
            </Field>

            <div>
              <p className="text-sm font-medium mb-2">Access Modes <span className="text-red-500">*</span></p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Select one or more access modes for the volume.
              </p>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={accessModes.includes('ReadWriteOnce')}
                    onChange={() => handleAccessModeToggle('ReadWriteOnce')}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">ReadWriteOnce (RWO)</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">- Volume can be mounted as read-write by a single node</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={accessModes.includes('ReadOnlyMany')}
                    onChange={() => handleAccessModeToggle('ReadOnlyMany')}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">ReadOnlyMany (ROX)</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">- Volume can be mounted as read-only by many nodes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={accessModes.includes('ReadWriteMany')}
                    onChange={() => handleAccessModeToggle('ReadWriteMany')}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">ReadWriteMany (RWX)</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">- Volume can be mounted as read-write by many nodes</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <Subheading className='mb-4'>Data Source (Optional)</Subheading>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={enableDataSource}
                  onChange={(e) => setEnableDataSource(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium">Clone from existing source</span>
              </label>
            </div>
            
            {enableDataSource && (
              <>
                <Field>
                  <Label>Source Kind</Label>
                  <Description>
                    Type of resource to clone from.
                  </Description>
                  <Dropdown 
                    name="dataSourceKind" 
                    value={dataSourceKind} 
                    onChange={(value) => setDataSourceKind(value)}
                    options={[
                      { value: 'PersistentVolumeClaim', label: 'PersistentVolumeClaim' },
                      { value: 'VolumeSnapshot', label: 'VolumeSnapshot' }
                    ]}
                  />
                </Field>

                <Field>
                  <Label>Source Name</Label>
                  <Description>
                    Name of the source resource.
                  </Description>
                  <Input 
                    name="dataSourceName" 
                    value={dataSourceName} 
                    onChange={(event) => setDataSourceName(event.target.value)} 
                    placeholder="e.g., source-pvc" 
                  />
                </Field>

                {dataSourceKind === 'VolumeSnapshot' && (
                  <Field>
                    <Label>API Group</Label>
                    <Description>
                      API group of the source (e.g., snapshot.storage.k8s.io).
                    </Description>
                    <Input 
                      name="dataSourceApiGroup" 
                      value={dataSourceApiGroup} 
                      onChange={(event) => setDataSourceApiGroup(event.target.value)} 
                      placeholder="e.g., snapshot.storage.k8s.io" 
                    />
                  </Field>
                )}
              </>
            )}
          </div>

          <div>
            <Subheading className='mb-4'>Volume Selector (Optional)</Subheading>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={enableSelector}
                  onChange={(e) => setEnableSelector(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium">Select specific persistent volume</span>
              </label>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Use labels to bind to a specific PersistentVolume.
              </p>
            </div>
            
            {enableSelector && (
              <>
                <p className="text-sm font-medium mb-2">Match Labels</p>
                <FieldLabels labels={selectorMatchLabels} setLabels={setSelectorMatchLabels} />
              </>
            )}
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