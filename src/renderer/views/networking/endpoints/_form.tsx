import { useState, useEffect } from 'react';
import { V1Endpoints, V1EndpointSubset, V1EndpointAddress, V1EndpointPort } from '@utils/k8s-types';
import { Field, Label, Description } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Dropdown } from '@components/base/dropdown';
import { Subheading } from '@components/base/heading';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import { NamespaceSelect } from '@components/form/field-namespace-select';
import helpObjects from '@help/index';
import { CodePanel } from '@components/code';
import { Button } from '@protoku/design-system';
import { TrashIcon } from '@heroicons/react/24/outline';

interface EndpointAddress {
  ip: string;
  hostname?: string;
  nodeName?: string;
  targetRefName?: string;
  targetRefKind?: string;
  targetRefUID?: string;
}

interface EndpointPort {
  name?: string;
  port: string;
  protocol: 'TCP' | 'UDP' | 'SCTP';
}

interface EndpointSubset {
  addresses: EndpointAddress[];
  notReadyAddresses: EndpointAddress[];
  ports: EndpointPort[];
}

interface EndpointsFormProps {
  endpoints?: V1Endpoints | null;
  onChange: (endpoints: any) => void;
  isEdit?: boolean;
}

export const EndpointsForm = ({ endpoints, onChange, isEdit = false }: EndpointsFormProps): JSX.Element => {
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>('default');
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [subsets, setSubsets] = useState<EndpointSubset[]>([{
    addresses: [{ ip: '' }],
    notReadyAddresses: [],
    ports: [{ name: '', port: '80', protocol: 'TCP' }]
  }]);

  useEffect(() => {
    if (endpoints) {
      setName(endpoints.metadata?.name || '');
      setNamespace(endpoints.metadata?.namespace || 'default');
      
      if (endpoints.metadata?.labels) {
        setLabels(Object.entries(endpoints.metadata.labels).map(([key, value]) => ({ key, value })));
      }
      
      if (endpoints.metadata?.annotations) {
        setAnnotations(Object.entries(endpoints.metadata.annotations).map(([key, value]) => ({ key, value })));
      }

      if (endpoints.subsets && endpoints.subsets.length > 0) {
        setSubsets(endpoints.subsets.map(subset => ({
          addresses: (subset.addresses || []).map(addr => ({
            ip: addr.ip || '',
            hostname: addr.hostname,
            nodeName: addr.nodeName,
            targetRefName: addr.targetRef?.name,
            targetRefKind: addr.targetRef?.kind,
            targetRefUID: addr.targetRef?.uid
          })),
          notReadyAddresses: (subset.notReadyAddresses || []).map(addr => ({
            ip: addr.ip || '',
            hostname: addr.hostname,
            nodeName: addr.nodeName,
            targetRefName: addr.targetRef?.name,
            targetRefKind: addr.targetRef?.kind,
            targetRefUID: addr.targetRef?.uid
          })),
          ports: (subset.ports || []).map(port => ({
            name: port.name,
            port: String(port.port || ''),
            protocol: (port.protocol as any) || 'TCP'
          }))
        })));
      }
    }
  }, [endpoints]);

  const handleAddSubset = () => {
    setSubsets([...subsets, {
      addresses: [{ ip: '' }],
      notReadyAddresses: [],
      ports: [{ name: '', port: '80', protocol: 'TCP' }]
    }]);
  };

  const handleRemoveSubset = (index: number) => {
    setSubsets(subsets.filter((_, i) => i !== index));
  };

  const handleAddAddress = (subsetIndex: number, type: 'addresses' | 'notReadyAddresses') => {
    const newSubsets = [...subsets];
    newSubsets[subsetIndex][type].push({ ip: '' });
    setSubsets(newSubsets);
  };

  const handleRemoveAddress = (subsetIndex: number, type: 'addresses' | 'notReadyAddresses', addressIndex: number) => {
    const newSubsets = [...subsets];
    newSubsets[subsetIndex][type] = newSubsets[subsetIndex][type].filter((_, i) => i !== addressIndex);
    setSubsets(newSubsets);
  };

  const handleAddressChange = (subsetIndex: number, type: 'addresses' | 'notReadyAddresses', addressIndex: number, field: keyof EndpointAddress, value: string) => {
    const newSubsets = [...subsets];
    (newSubsets[subsetIndex][type][addressIndex] as any)[field] = value || undefined;
    setSubsets(newSubsets);
  };

  const handleAddPort = (subsetIndex: number) => {
    const newSubsets = [...subsets];
    newSubsets[subsetIndex].ports.push({ name: '', port: '', protocol: 'TCP' });
    setSubsets(newSubsets);
  };

  const handleRemovePort = (subsetIndex: number, portIndex: number) => {
    const newSubsets = [...subsets];
    newSubsets[subsetIndex].ports = newSubsets[subsetIndex].ports.filter((_, i) => i !== portIndex);
    setSubsets(newSubsets);
  };

  const handlePortChange = (subsetIndex: number, portIndex: number, field: keyof EndpointPort, value: string) => {
    const newSubsets = [...subsets];
    (newSubsets[subsetIndex].ports[portIndex] as any)[field] = value;
    setSubsets(newSubsets);
  };

  const payload = {
    apiVersion: 'v1',
    kind: 'Endpoints',
    metadata: {
      name,
      namespace,
      labels: labels.filter(l => l.key && l.value).reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {}),
      annotations: annotations.filter(a => a.key && a.value).reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {})
    },
    subsets: subsets.map(subset => ({
      addresses: subset.addresses.filter(addr => addr.ip).map(addr => ({
        ip: addr.ip,
        ...(addr.hostname && { hostname: addr.hostname }),
        ...(addr.nodeName && { nodeName: addr.nodeName }),
        ...(addr.targetRefName && {
          targetRef: {
            name: addr.targetRefName,
            ...(addr.targetRefKind && { kind: addr.targetRefKind }),
            ...(addr.targetRefUID && { uid: addr.targetRefUID })
          }
        })
      })),
      ...(subset.notReadyAddresses.length > 0 && {
        notReadyAddresses: subset.notReadyAddresses.filter(addr => addr.ip).map(addr => ({
          ip: addr.ip,
          ...(addr.hostname && { hostname: addr.hostname }),
          ...(addr.nodeName && { nodeName: addr.nodeName }),
          ...(addr.targetRefName && {
            targetRef: {
              name: addr.targetRefName,
              ...(addr.targetRefKind && { kind: addr.targetRefKind }),
              ...(addr.targetRefUID && { uid: addr.targetRefUID })
            }
          })
        }))
      }),
      ports: subset.ports.filter(port => port.port).map(port => ({
        ...(port.name && { name: port.name }),
        port: parseInt(port.port),
        protocol: port.protocol
      }))
    })).filter(subset => subset.addresses.length > 0 || (subset.notReadyAddresses && subset.notReadyAddresses.length > 0))
  };

  useEffect(() => {
    onChange(payload);
  }, [name, namespace, labels, annotations, subsets]);

  return (
    <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
      <div className='px-4 space-y-6'>
        <div>
          <Subheading className='mb-4'>Metadata</Subheading>
          
          <Field>
            <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
            <Description>
              Enter a unique name for your endpoints.
            </Description>
            <Input 
              name="name" 
              value={name} 
              onChange={(event) => setName(event.target.value)} 
              placeholder="e.g., my-service"
              disabled={isEdit}
            />
          </Field>

          <Field>
            <Label>Namespace</Label>
            <Description>
              Select the namespace for these endpoints.
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

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Subheading>Subsets</Subheading>
            <Button variant="secondary" onClick={handleAddSubset}>Add Subset</Button>
          </div>

          {subsets.map((subset, subsetIndex) => (
            <div key={subsetIndex} className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Subset {subsetIndex + 1}</h4>
                <button
                  onClick={() => handleRemoveSubset(subsetIndex)}
                  disabled={subsets.length === 1}
                  className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 disabled:opacity-50"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>

              <Field>
                <div className="flex items-center justify-between mb-2">
                  <Label>Ready Addresses</Label>
                  <Button 
                    variant="secondary" 
                    onClick={() => handleAddAddress(subsetIndex, 'addresses')}
                    className="text-xs"
                  >
                    Add Address
                  </Button>
                </div>
                <div className="space-y-2">
                  {subset.addresses.map((address, addressIndex) => (
                    <div key={addressIndex} className="flex items-start space-x-2">
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <Input
                          placeholder="IP Address"
                          value={address.ip}
                          onChange={(e) => handleAddressChange(subsetIndex, 'addresses', addressIndex, 'ip', e.target.value)}
                        />
                        <Input
                          placeholder="Hostname (optional)"
                          value={address.hostname || ''}
                          onChange={(e) => handleAddressChange(subsetIndex, 'addresses', addressIndex, 'hostname', e.target.value)}
                        />
                        <Input
                          placeholder="Node Name (optional)"
                          value={address.nodeName || ''}
                          onChange={(e) => handleAddressChange(subsetIndex, 'addresses', addressIndex, 'nodeName', e.target.value)}
                        />
                      </div>
                      <button
                        onClick={() => handleRemoveAddress(subsetIndex, 'addresses', addressIndex)}
                        disabled={subset.addresses.length === 1}
                        className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 disabled:opacity-50"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </Field>

              <Field>
                <div className="flex items-center justify-between mb-2">
                  <Label>Not Ready Addresses</Label>
                  <Button 
                    variant="secondary" 
                    onClick={() => handleAddAddress(subsetIndex, 'notReadyAddresses')}
                    className="text-xs"
                  >
                    Add Address
                  </Button>
                </div>
                {subset.notReadyAddresses.length > 0 && (
                  <div className="space-y-2">
                    {subset.notReadyAddresses.map((address, addressIndex) => (
                      <div key={addressIndex} className="flex items-start space-x-2">
                        <div className="flex-1 grid grid-cols-3 gap-2">
                          <Input
                            placeholder="IP Address"
                            value={address.ip}
                            onChange={(e) => handleAddressChange(subsetIndex, 'notReadyAddresses', addressIndex, 'ip', e.target.value)}
                          />
                          <Input
                            placeholder="Hostname (optional)"
                            value={address.hostname || ''}
                            onChange={(e) => handleAddressChange(subsetIndex, 'notReadyAddresses', addressIndex, 'hostname', e.target.value)}
                          />
                          <Input
                            placeholder="Node Name (optional)"
                            value={address.nodeName || ''}
                            onChange={(e) => handleAddressChange(subsetIndex, 'notReadyAddresses', addressIndex, 'nodeName', e.target.value)}
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveAddress(subsetIndex, 'notReadyAddresses', addressIndex)}
                          className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </Field>

              <Field>
                <div className="flex items-center justify-between mb-2">
                  <Label>Ports</Label>
                  <Button 
                    variant="secondary" 
                    onClick={() => handleAddPort(subsetIndex)}
                    className="text-xs"
                  >
                    Add Port
                  </Button>
                </div>
                <div className="space-y-2">
                  {subset.ports.map((port, portIndex) => (
                    <div key={portIndex} className="flex items-start space-x-2">
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <Input
                          placeholder="Port name (optional)"
                          value={port.name || ''}
                          onChange={(e) => handlePortChange(subsetIndex, portIndex, 'name', e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Port"
                          value={port.port}
                          onChange={(e) => handlePortChange(subsetIndex, portIndex, 'port', e.target.value)}
                        />
                        <Dropdown
                          value={port.protocol}
                          onChange={(value) => handlePortChange(subsetIndex, portIndex, 'protocol', value)}
                          options={[
                            { value: 'TCP', label: 'TCP' },
                            { value: 'UDP', label: 'UDP' },
                            { value: 'SCTP', label: 'SCTP' }
                          ]}
                        />
                      </div>
                      <button
                        onClick={() => handleRemovePort(subsetIndex, portIndex)}
                        disabled={subset.ports.length === 1}
                        className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 disabled:opacity-50"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </Field>
            </div>
          ))}
        </div>
      </div>

      <div className='px-4'>
        <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>
      </div>
    </div>
  );
};