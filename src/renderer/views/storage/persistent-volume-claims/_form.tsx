import { Field, Label, Description } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Dropdown } from '@components/base/dropdown';
import { Subheading } from '@components/base/heading';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { HelpButton } from '@components/help-button';
import { NamespaceSelect } from '@components/form/field-namespace-select';
import helpObjects from '@help/index';

interface PersistentVolumeClaimFormProps {
  name: string;
  setName: (value: string) => void;
  namespace: string;
  setNamespace: (value: string) => void;
  labels: FieldLabel[];
  setLabels: (value: FieldLabel[]) => void;
  annotations: FieldAnnotation[];
  setAnnotations: (value: FieldAnnotation[]) => void;
  accessModes: string[];
  setAccessModes: (value: string[]) => void;
  storageClassName: string;
  setStorageClassName: (value: string) => void;
  storage: string;
  setStorage: (value: string) => void;
  volumeMode: 'Filesystem' | 'Block';
  setVolumeMode: (value: 'Filesystem' | 'Block') => void;
  enableDataSource: boolean;
  setEnableDataSource: (value: boolean) => void;
  dataSourceKind: string;
  setDataSourceKind: (value: string) => void;
  dataSourceName: string;
  setDataSourceName: (value: string) => void;
  dataSourceApiGroup: string;
  setDataSourceApiGroup: (value: string) => void;
  enableSelector: boolean;
  setEnableSelector: (value: boolean) => void;
  selectorMatchLabels: FieldLabel[];
  setSelectorMatchLabels: (value: FieldLabel[]) => void;
  isEdit?: boolean;
}

export const PersistentVolumeClaimForm = ({
  name,
  setName,
  namespace,
  setNamespace,
  labels,
  setLabels,
  annotations,
  setAnnotations,
  accessModes,
  setAccessModes,
  storageClassName,
  setStorageClassName,
  storage,
  setStorage,
  volumeMode,
  setVolumeMode,
  enableDataSource,
  setEnableDataSource,
  dataSourceKind,
  setDataSourceKind,
  dataSourceName,
  setDataSourceName,
  dataSourceApiGroup,
  setDataSourceApiGroup,
  enableSelector,
  setEnableSelector,
  selectorMatchLabels,
  setSelectorMatchLabels,
  isEdit = false
}: PersistentVolumeClaimFormProps): JSX.Element => {
  const handleAccessModeToggle = (mode: string) => {
    if (accessModes.includes(mode)) {
      setAccessModes(accessModes.filter(m => m !== mode));
    } else {
      setAccessModes([...accessModes, mode]);
    }
  };

  return (
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
            disabled={isEdit}
          />
        </Field>

        <Field>
          <Label>Namespace</Label>
          <Description>
            Select the namespace for this persistent volume claim.
          </Description>
          <NamespaceSelect 
            value={namespace} 
            onChange={setNamespace}
            disabled={isEdit}
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
  );
};