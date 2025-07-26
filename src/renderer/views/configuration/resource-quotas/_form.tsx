import { Field, Label, Description } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Subheading } from '@components/base/heading';
import { Button } from '@protoku/design-system';
import { HelpButton } from '@components/help-button';
import { NamespaceSelect } from '@components/form/field-namespace-select';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import helpObjects from '@help/index';

interface HardResource {
  resource: string;
  value: string;
}

interface ResourceQuotaFormProps {
  name: string;
  setName: (name: string) => void;
  namespace: string;
  setNamespace: (namespace: string) => void;
  labels: FieldLabel[];
  setLabels: (labels: FieldLabel[]) => void;
  annotations: FieldAnnotation[];
  setAnnotations: (annotations: FieldAnnotation[]) => void;
  hard: HardResource[];
  setHard: (hard: HardResource[]) => void;
  scopes: string[];
  setScopes: (scopes: string[]) => void;
  isEdit?: boolean;
}

export const ResourceQuotaForm = ({
  name,
  setName,
  namespace,
  setNamespace,
  labels,
  setLabels,
  annotations,
  setAnnotations,
  hard,
  setHard,
  scopes,
  setScopes,
  isEdit = false
}: ResourceQuotaFormProps): JSX.Element => {
  const commonResources = [
    { name: 'requests.cpu', description: 'Total CPU requests' },
    { name: 'requests.memory', description: 'Total memory requests' },
    { name: 'limits.cpu', description: 'Total CPU limits' },
    { name: 'limits.memory', description: 'Total memory limits' },
    { name: 'requests.storage', description: 'Total storage requests' },
    { name: 'persistentvolumeclaims', description: 'Number of PVCs' },
    { name: 'pods', description: 'Number of pods' },
    { name: 'services', description: 'Number of services' },
    { name: 'services.loadbalancers', description: 'Number of LoadBalancer services' },
    { name: 'services.nodeports', description: 'Number of NodePort services' },
    { name: 'configmaps', description: 'Number of ConfigMaps' },
    { name: 'secrets', description: 'Number of Secrets' }
  ];

  const availableScopes = [
    'Terminating',
    'NotTerminating',
    'BestEffort',
    'NotBestEffort',
    'PriorityClass',
    'CrossNamespacePodAffinity'
  ];

  const handleAddHardResource = () => {
    setHard([...hard, { resource: '', value: '' }]);
  };

  const handleRemoveHardResource = (index: number) => {
    setHard(hard.filter((_, i) => i !== index));
  };

  const handleHardResourceChange = (index: number, field: keyof HardResource, value: string) => {
    const newHard = [...hard];
    newHard[index][field] = value;
    setHard(newHard);
  };

  const handleScopeToggle = (scope: string) => {
    if (scopes.includes(scope)) {
      setScopes(scopes.filter(s => s !== scope));
    } else {
      setScopes([...scopes, scope]);
    }
  };

  return (
    <div className='px-4 space-y-6'>
      <div>
        <Subheading className='mb-4'>Metadata</Subheading>
        
        <Field>
          <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
          <Description>
            Enter a unique name for your resource quota.
          </Description>
          <Input 
            name="name" 
            value={name} 
            onChange={(event) => setName(event.target.value)} 
            placeholder="e.g., compute-quota" 
            disabled={isEdit}
          />
        </Field>

        <Field>
          <Label>Namespace</Label>
          <Description>
            Select the namespace for this resource quota.
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
        <Subheading className='mb-4'>Resource Limits</Subheading>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Define the resource limits for this namespace.
        </p>
        
        {hard.map((item, index) => (
          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded p-3 mb-3">
            <Field>
              <Label>Resource <span className="text-red-500">*</span></Label>
              <Input
                value={item.resource}
                onChange={(e) => handleHardResourceChange(index, 'resource', e.target.value)}
                placeholder="e.g., requests.cpu"
                list={`resources-${index}`}
              />
              <datalist id={`resources-${index}`}>
                {commonResources.map(res => (
                  <option key={res.name} value={res.name} />
                ))}
              </datalist>
            </Field>
            
            <Field>
              <Label>Limit <span className="text-red-500">*</span></Label>
              <Input
                value={item.value}
                onChange={(e) => handleHardResourceChange(index, 'value', e.target.value)}
                placeholder="e.g., 100, 10Gi, 1000m"
              />
            </Field>
            
            <Button
              color="red"
              onClick={() => handleRemoveHardResource(index)}
              disabled={hard.length === 1}
            >
              Remove Resource
            </Button>
          </div>
        ))}
        
        <Button color="dark/white" onClick={handleAddHardResource}>
          Add Resource Limit
        </Button>

        <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
          <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">Common Resources:</p>
          <div className="space-y-1">
            {commonResources.map(res => (
              <div key={res.name} className="text-xs">
                <code className="font-mono">{res.name}</code> - {res.description}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <Subheading className='mb-4'>Quota Scopes (Optional)</Subheading>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Limit the quota to specific types of objects.
        </p>
        
        <div className="space-y-2">
          {availableScopes.map(scope => (
            <label key={scope} className="flex items-center">
              <input
                type="checkbox"
                checked={scopes.includes(scope)}
                onChange={() => handleScopeToggle(scope)}
                className="mr-2"
              />
              <span className="text-sm font-medium">{scope}</span>
            </label>
          ))}
        </div>

        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Note:</strong> Scopes limit which objects consume quota. For example:
            <br/>• <code>Terminating</code> - Only pods with activeDeadlineSeconds
            <br/>• <code>NotTerminating</code> - Only pods without activeDeadlineSeconds
            <br/>• <code>BestEffort</code> - Only pods with BestEffort QoS
            <br/>• <code>NotBestEffort</code> - Only pods with Burstable or Guaranteed QoS
          </p>
        </div>
      </div>
    </div>
  );
};