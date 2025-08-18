import { useState, useEffect } from 'react';
import { V1EndpointSlice } from '@utils/k8s-types';
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
import { Checkbox } from '@components/base/checkbox';


interface EndpointPort {
  name?: string;
  port?: string;
  protocol: 'TCP' | 'UDP' | 'SCTP';
  appProtocol?: string;
}

interface Endpoint {
  addresses: string[];
  conditions?: {
    ready?: boolean;
    serving?: boolean;
    terminating?: boolean;
  };
  hostname?: string;
  nodeName?: string;
  zone?: string;
  targetRef?: {
    name?: string;
    kind?: string;
    uid?: string;
  };
}

interface EndpointSlicesFormProps {
  endpointSlice?: V1EndpointSlice | null;
  onChange: (endpointSlice: any) => void;
  isEdit?: boolean;
}

export const EndpointSlicesForm = ({ endpointSlice, onChange, isEdit = false }: EndpointSlicesFormProps): JSX.Element => {
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>('default');
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [addressType, setAddressType] = useState<'IPv4' | 'IPv6' | 'FQDN'>('IPv4');
  const [endpoints, setEndpoints] = useState<Endpoint[]>([{
    addresses: [''],
    conditions: { ready: true, serving: true, terminating: false }
  }]);
  const [ports, setPorts] = useState<EndpointPort[]>([{ name: '', port: '80', protocol: 'TCP' }]);

  useEffect(() => {
    if (endpointSlice) {
      setName(endpointSlice.metadata?.name || '');
      setNamespace(endpointSlice.metadata?.namespace || 'default');
      
      if (endpointSlice.metadata?.labels) {
        setLabels(Object.entries(endpointSlice.metadata.labels).map(([key, value]) => ({ key, value })));
      }
      
      if (endpointSlice.metadata?.annotations) {
        setAnnotations(Object.entries(endpointSlice.metadata.annotations).map(([key, value]) => ({ key, value })));
      }

      setAddressType((endpointSlice.addressType as any) || 'IPv4');

      if (endpointSlice.endpoints && endpointSlice.endpoints.length > 0) {
        setEndpoints(endpointSlice.endpoints.map(ep => ({
          addresses: ep.addresses || [''],
          conditions: {
            ready: ep.conditions?.ready,
            serving: ep.conditions?.serving,
            terminating: ep.conditions?.terminating
          },
          hostname: ep.hostname,
          nodeName: ep.nodeName,
          zone: ep.zone,
          targetRef: ep.targetRef ? {
            name: ep.targetRef.name,
            kind: ep.targetRef.kind,
            uid: ep.targetRef.uid
          } : undefined
        })));
      }

      if (endpointSlice.ports && endpointSlice.ports.length > 0) {
        setPorts(endpointSlice.ports.map(port => ({
          name: port.name,
          port: port.port ? String(port.port) : '',
          protocol: (port.protocol as any) || 'TCP',
          appProtocol: port.appProtocol
        })));
      }
    }
  }, [endpointSlice]);

  const handleAddEndpoint = () => {
    setEndpoints([...endpoints, {
      addresses: [''],
      conditions: { ready: true, serving: true, terminating: false }
    }]);
  };

  const handleRemoveEndpoint = (index: number) => {
    setEndpoints(endpoints.filter((_, i) => i !== index));
  };

  const handleEndpointChange = (index: number, field: keyof Endpoint, value: any) => {
    const newEndpoints = [...endpoints];
    (newEndpoints[index] as any)[field] = value;
    setEndpoints(newEndpoints);
  };

  const handleAddAddress = (endpointIndex: number) => {
    const newEndpoints = [...endpoints];
    newEndpoints[endpointIndex].addresses.push('');
    setEndpoints(newEndpoints);
  };

  const handleRemoveAddress = (endpointIndex: number, addressIndex: number) => {
    const newEndpoints = [...endpoints];
    newEndpoints[endpointIndex].addresses = newEndpoints[endpointIndex].addresses.filter((_, i) => i !== addressIndex);
    setEndpoints(newEndpoints);
  };

  const handleAddressChange = (endpointIndex: number, addressIndex: number, value: string) => {
    const newEndpoints = [...endpoints];
    newEndpoints[endpointIndex].addresses[addressIndex] = value;
    setEndpoints(newEndpoints);
  };

  const handleAddPort = () => {
    setPorts([...ports, { name: '', port: '', protocol: 'TCP' }]);
  };

  const handleRemovePort = (index: number) => {
    setPorts(ports.filter((_, i) => i !== index));
  };

  const handlePortChange = (index: number, field: keyof EndpointPort, value: string) => {
    const newPorts = [...ports];
    (newPorts[index] as any)[field] = value;
    setPorts(newPorts);
  };

  const payload = {
    apiVersion: 'discovery.k8s.io/v1',
    kind: 'EndpointSlice',
    metadata: {
      name,
      namespace,
      labels: labels.filter(l => l.key && l.value).reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {}),
      annotations: annotations.filter(a => a.key && a.value).reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {})
    },
    addressType,
    endpoints: endpoints.filter(ep => ep.addresses.some(addr => addr)).map(ep => ({
      addresses: ep.addresses.filter(addr => addr),
      ...(Object.values(ep.conditions || {}).some(v => v !== undefined) && { conditions: ep.conditions }),
      ...(ep.hostname && { hostname: ep.hostname }),
      ...(ep.nodeName && { nodeName: ep.nodeName }),
      ...(ep.zone && { zone: ep.zone }),
      ...(ep.targetRef?.name && {
        targetRef: {
          name: ep.targetRef.name,
          ...(ep.targetRef.kind && { kind: ep.targetRef.kind }),
          ...(ep.targetRef.uid && { uid: ep.targetRef.uid })
        }
      })
    })),
    ...(ports.filter(port => port.port).length > 0 && {
      ports: ports.filter(port => port.port).map(port => ({
        ...(port.name && { name: port.name }),
        port: parseInt(port.port || '0'),
        protocol: port.protocol,
        ...(port.appProtocol && { appProtocol: port.appProtocol })
      }))
    })
  };

  useEffect(() => {
    onChange(payload);
  }, [name, namespace, labels, annotations, addressType, endpoints, ports]);

  return (
    <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
      <div className='px-4 space-y-6'>
        <div>
          <Subheading className='mb-4'>Metadata</Subheading>
          
          <Field>
            <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
            <Description>
              Enter a unique name for your endpoint slice.
            </Description>
            <Input 
              name="name" 
              value={name} 
              onChange={(event) => setName(event.target.value)} 
              placeholder="e.g., my-service-abc123"
              disabled={isEdit}
            />
          </Field>

          <Field>
            <Label>Namespace</Label>
            <Description>
              Select the namespace for this endpoint slice.
            </Description>
            <NamespaceSelect 
              value={namespace} 
              onChange={setNamespace}
              disabled={isEdit}
            />
          </Field>

          <Field>
            <Label>Address Type</Label>
            <Description>
              The type of addresses this slice contains.
            </Description>
            <Dropdown
              value={addressType}
              onChange={(value) => setAddressType(value as 'IPv4' | 'IPv6' | 'FQDN')}
              disabled={isEdit}
              options={[
                { value: 'IPv4', label: 'IPv4' },
                { value: 'IPv6', label: 'IPv6' },
                { value: 'FQDN', label: 'FQDN' }
              ]}
            />
          </Field>

          <FieldLabels labels={labels} setLabels={setLabels} />
          <FieldAnnotations annotations={annotations} setAnnotations={setAnnotations} />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <Subheading>Ports</Subheading>
            <Button variant="secondary" onClick={handleAddPort}>Add Port</Button>
          </div>
          
          <div className="space-y-2">
            {ports.map((port, index) => (
              <div key={index} className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <div className="flex items-start space-x-2">
                  <div className="flex-1 grid grid-cols-2 gap-2">
                    <div>
                      <Input
                        placeholder="Port name (optional)"
                        value={port.name || ''}
                        onChange={(e) => handlePortChange(index, 'name', e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="Port number"
                        value={port.port || ''}
                        onChange={(e) => handlePortChange(index, 'port', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Dropdown
                        value={port.protocol}
                        onChange={(value) => handlePortChange(index, 'protocol', value)}
                        options={[
                          { value: 'TCP', label: 'TCP' },
                          { value: 'UDP', label: 'UDP' },
                          { value: 'SCTP', label: 'SCTP' }
                        ]}
                      />
                      <Input
                        placeholder="App Protocol (optional)"
                        value={port.appProtocol || ''}
                        onChange={(e) => handlePortChange(index, 'appProtocol', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemovePort(index)}
                    disabled={ports.length === 1}
                    className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 disabled:opacity-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Subheading>Endpoints</Subheading>
            <Button variant="secondary" onClick={handleAddEndpoint}>Add Endpoint</Button>
          </div>

          {endpoints.map((endpoint, endpointIndex) => (
            <div key={endpointIndex} className="p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Endpoint {endpointIndex + 1}</h4>
                <button
                  onClick={() => handleRemoveEndpoint(endpointIndex)}
                  disabled={endpoints.length === 1}
                  className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 disabled:opacity-50"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>

              <Field>
                <div className="flex items-center justify-between mb-2">
                  <Label>Addresses</Label>
                  <Button 
                    variant="secondary" 
                    onClick={() => handleAddAddress(endpointIndex)}
                    className="text-xs"
                  >
                    Add Address
                  </Button>
                </div>
                <div className="space-y-2">
                  {endpoint.addresses.map((address, addressIndex) => (
                    <div key={addressIndex} className="flex items-center space-x-2">
                      <Input
                        placeholder={addressType === 'FQDN' ? 'example.com' : addressType === 'IPv6' ? '::1' : '192.168.1.1'}
                        value={address}
                        onChange={(e) => handleAddressChange(endpointIndex, addressIndex, e.target.value)}
                        className="flex-1"
                      />
                      <button
                        onClick={() => handleRemoveAddress(endpointIndex, addressIndex)}
                        disabled={endpoint.addresses.length === 1}
                        className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 disabled:opacity-50"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Hostname (optional)"
                  value={endpoint.hostname || ''}
                  onChange={(e) => handleEndpointChange(endpointIndex, 'hostname', e.target.value)}
                />
                <Input
                  placeholder="Node Name (optional)"
                  value={endpoint.nodeName || ''}
                  onChange={(e) => handleEndpointChange(endpointIndex, 'nodeName', e.target.value)}
                />
              </div>

              <Field>
                <Label className="mb-2">Conditions</Label>
                <div className="space-y-2">
                  <Checkbox
                    checked={endpoint.conditions?.ready || false}
                    onChange={(checked) => handleEndpointChange(endpointIndex, 'conditions', {
                      ...endpoint.conditions,
                      ready: checked
                    })}
                  >
                    Ready
                  </Checkbox>
                  <Checkbox
                    checked={endpoint.conditions?.serving || false}
                    onChange={(checked) => handleEndpointChange(endpointIndex, 'conditions', {
                      ...endpoint.conditions,
                      serving: checked
                    })}
                  >
                    Serving
                  </Checkbox>
                  <Checkbox
                    checked={endpoint.conditions?.terminating || false}
                    onChange={(checked) => handleEndpointChange(endpointIndex, 'conditions', {
                      ...endpoint.conditions,
                      terminating: checked
                    })}
                  >
                    Terminating
                  </Checkbox>
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