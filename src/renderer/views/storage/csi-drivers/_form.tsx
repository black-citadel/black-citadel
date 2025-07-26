import { Field, Label, Description } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Select } from '@components/base/select';
import { Checkbox } from '@components/base/checkbox';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { Button } from '@protoku/design-system';
import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

interface TokenRequest {
  audience: string;
  expirationSeconds: string;
}

interface CSIDriverFormProps {
  name: string;
  setName: (value: string) => void;
  labels: FieldLabel[];
  setLabels: (labels: FieldLabel[]) => void;
  annotations: FieldAnnotation[];
  setAnnotations: (annotations: FieldAnnotation[]) => void;
  attachRequired: boolean;
  setAttachRequired: (value: boolean) => void;
  podInfoOnMount: boolean;
  setPodInfoOnMount: (value: boolean) => void;
  storageCapacity: boolean;
  setStorageCapacity: (value: boolean) => void;
  fsGroupPolicy: 'ReadWriteOnceWithFSType' | 'File' | 'None' | '';
  setFsGroupPolicy: (value: 'ReadWriteOnceWithFSType' | 'File' | 'None' | '') => void;
  requiresRepublish: boolean;
  setRequiresRepublish: (value: boolean) => void;
  volumeLifecycleModes: string[];
  setVolumeLifecycleModes: (value: string[]) => void;
  tokenRequests: TokenRequest[];
  setTokenRequests: (value: TokenRequest[]) => void;
  isEdit?: boolean;
}

export const CSIDriverForm = ({
  name,
  setName,
  labels,
  setLabels,
  annotations,
  setAnnotations,
  attachRequired,
  setAttachRequired,
  podInfoOnMount,
  setPodInfoOnMount,
  storageCapacity,
  setStorageCapacity,
  fsGroupPolicy,
  setFsGroupPolicy,
  requiresRepublish,
  setRequiresRepublish,
  volumeLifecycleModes,
  setVolumeLifecycleModes,
  tokenRequests,
  setTokenRequests,
  isEdit = false
}: CSIDriverFormProps): JSX.Element => {
  const toggleVolumeLifecycleMode = (mode: string) => {
    if (volumeLifecycleModes.includes(mode)) {
      setVolumeLifecycleModes(volumeLifecycleModes.filter(m => m !== mode));
    } else {
      setVolumeLifecycleModes([...volumeLifecycleModes, mode]);
    }
  };

  const addTokenRequest = () => {
    setTokenRequests([...tokenRequests, { audience: '', expirationSeconds: '' }]);
  };

  const removeTokenRequest = (index: number) => {
    setTokenRequests(tokenRequests.filter((_, i) => i !== index));
  };

  const updateTokenRequest = (index: number, field: keyof TokenRequest, value: string) => {
    const updated = [...tokenRequests];
    updated[index] = { ...updated[index], [field]: value };
    setTokenRequests(updated);
  };

  return (
    <div className='px-4'>
      <div className='pb-8'>
        <h2 className='text-base font-semibold leading-7'>CSI Driver</h2>
        <Field>
          <Label>Name <span className="text-red-500">*</span></Label>
          <Input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder='my-csi-driver'
            disabled={isEdit}
          />
        </Field>

        <Field>
          <Label>Attach Required</Label>
          <Checkbox
            checked={attachRequired}
            onChange={setAttachRequired}
          />
          <Description>
            Indicates if volumes need to be attached to nodes before being mounted
          </Description>
        </Field>

        <Field>
          <Label>Pod Info on Mount</Label>
          <Checkbox
            checked={podInfoOnMount}
            onChange={setPodInfoOnMount}
          />
          <Description>
            Whether to pass Pod information when mounting volumes
          </Description>
        </Field>

        <Field>
          <Label>Storage Capacity</Label>
          <Checkbox
            checked={storageCapacity}
            onChange={setStorageCapacity}
          />
          <Description>
            Indicates if the CSI driver wants to report storage capacity
          </Description>
        </Field>

        <Field>
          <Label>FS Group Policy</Label>
          <Select value={fsGroupPolicy} onChange={(e) => setFsGroupPolicy(e.target.value as any)}>
            <option value="">None</option>
            <option value="ReadWriteOnceWithFSType">ReadWriteOnceWithFSType</option>
            <option value="File">File</option>
            <option value="None">None</option>
          </Select>
          <Description>
            Defines if the CSI driver supports changing ownership and permissions of volumes
          </Description>
        </Field>

        <Field>
          <Label>Requires Volume Republish</Label>
          <Checkbox
            checked={requiresRepublish}
            onChange={setRequiresRepublish}
          />
          <Description>
            Indicates if volumes need to be republished after node restarts
          </Description>
        </Field>

        <Field>
          <Label>Volume Lifecycle Modes</Label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={volumeLifecycleModes.includes('Persistent')}
                onChange={() => toggleVolumeLifecycleMode('Persistent')}
                className="rounded border-gray-300"
              />
              <span>Persistent</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={volumeLifecycleModes.includes('Ephemeral')}
                onChange={() => toggleVolumeLifecycleMode('Ephemeral')}
                className="rounded border-gray-300"
              />
              <span>Ephemeral</span>
            </label>
          </div>
          <Description>
            Defines the volume lifecycle modes that this CSI driver supports
          </Description>
        </Field>

        <div className='pb-4'>
          <div className='flex items-center justify-between mb-2'>
            <h3 className='text-sm font-medium'>Token Requests</h3>
            <Button variant="secondary" size="sm" onClick={addTokenRequest}>
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Token Request
            </Button>
          </div>
          {tokenRequests.map((request, index) => (
            <div key={index} className="border rounded-lg p-4 mb-2">
              <div className="flex justify-end mb-2">
                <button
                  type="button"
                  onClick={() => removeTokenRequest(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              <Field>
                <Label>Audience <span className="text-red-500">*</span></Label>
                <Input
                  value={request.audience}
                  onChange={(e) => updateTokenRequest(index, 'audience', e.target.value)}
                  placeholder='sts.amazonaws.com'
                />
              </Field>
              <Field>
                <Label>Expiration Seconds</Label>
                <Input
                  type="number"
                  value={request.expirationSeconds}
                  onChange={(e) => updateTokenRequest(index, 'expirationSeconds', e.target.value)}
                  placeholder='3600'
                />
                <Description>
                  Duration of validity of the token in seconds
                </Description>
              </Field>
            </div>
          ))}
        </div>
      </div>

      <div className='pb-8'>
        <h2 className='text-base font-semibold leading-7'>Metadata</h2>
        <FieldLabels labels={labels} setLabels={setLabels} />
        <FieldAnnotations annotations={annotations} setAnnotations={setAnnotations} />
      </div>
    </div>
  );
};