import { useState, useEffect } from 'react';
import { V1Service } from '@utils/k8s-types';
import { Field, Label, Description } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Dropdown, DropdownOption } from '@components/base/dropdown';
import { Subheading } from '@components/base/heading';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { serviceTemplate } from '@templates/service.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import { NamespaceSelect } from '@components/form/field-namespace-select';
import helpObjects from '@help/index';
import { CodePanel } from '@components/code';
import { Button } from '@protoku/design-system';
import { TrashIcon } from '@heroicons/react/24/outline';

interface ServicePort {
  name?: string;
  port: string;
  targetPort: string;
  protocol: 'TCP' | 'UDP' | 'SCTP';
  nodePort?: string;
}

interface ServiceFormProps {
  service?: V1Service | null;
  onChange: (service: any) => void;
  isEdit?: boolean;
}

export const ServiceForm = ({ service, onChange, isEdit = false }: ServiceFormProps): JSX.Element => {
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>('default');
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [type, setType] = useState<'ClusterIP' | 'NodePort' | 'LoadBalancer' | 'ExternalName'>('ClusterIP');
  const [selector, setSelector] = useState<FieldLabel[]>([{ key: 'app', value: '' }]);
  const [ports, setPorts] = useState<ServicePort[]>([{ name: '', port: '80', targetPort: '80', protocol: 'TCP' }]);
  const [sessionAffinity, setSessionAffinity] = useState<'None' | 'ClientIP'>('None');
  const [externalName, setExternalName] = useState<string>('');
  const [loadBalancerIP, setLoadBalancerIP] = useState<string>('');
  const [externalTrafficPolicy, setExternalTrafficPolicy] = useState<'Cluster' | 'Local'>('Cluster');

  useEffect(() => {
    if (service) {
      setName(service.metadata?.name || '');
      setNamespace(service.metadata?.namespace || 'default');
      
      if (service.metadata?.labels) {
        setLabels(Object.entries(service.metadata.labels).map(([key, value]) => ({ key, value })));
      }
      
      if (service.metadata?.annotations) {
        setAnnotations(Object.entries(service.metadata.annotations).map(([key, value]) => ({ key, value })));
      }

      setType((service.spec?.type as any) || 'ClusterIP');
      
      if (service.spec?.selector) {
        setSelector(Object.entries(service.spec.selector).map(([key, value]) => ({ key, value })));
      }

      if (service.spec?.ports) {
        setPorts(service.spec.ports.map(port => ({
          name: port.name || '',
          port: String(port.port),
          targetPort: String(port.targetPort || port.port),
          protocol: (port.protocol as any) || 'TCP',
          nodePort: port.nodePort ? String(port.nodePort) : ''
        })));
      }

      setSessionAffinity((service.spec?.sessionAffinity as any) || 'None');
      setExternalName(service.spec?.externalName || '');
      setLoadBalancerIP(service.spec?.loadBalancerIP || '');
      setExternalTrafficPolicy((service.spec?.externalTrafficPolicy as any) || 'Cluster');
    }
  }, [service]);

  const parsedPorts = ports.map(port => ({
    ...port,
    port: parseInt(port.port) || 0,
    targetPort: isNaN(parseInt(port.targetPort)) ? port.targetPort : parseInt(port.targetPort),
    nodePort: port.nodePort ? parseInt(port.nodePort) : undefined
  }));

  const payload = serviceTemplate({
    name,
    namespace,
    labels,
    annotations,
    type,
    selector,
    ports: parsedPorts,
    sessionAffinity,
    externalName: type === 'ExternalName' ? externalName : undefined,
    loadBalancerIP: type === 'LoadBalancer' ? loadBalancerIP : undefined,
    externalTrafficPolicy: (type === 'NodePort' || type === 'LoadBalancer') ? externalTrafficPolicy : undefined
  });

  useEffect(() => {
    onChange(payload);
  }, [name, namespace, labels, annotations, type, selector, ports, sessionAffinity, externalName, loadBalancerIP, externalTrafficPolicy]);

  const handleAddPort = () => {
    setPorts([...ports, { name: '', port: '', targetPort: '', protocol: 'TCP' }]);
  };

  const handleRemovePort = (index: number) => {
    setPorts(ports.filter((_, i) => i !== index));
  };

  const handlePortChange = (index: number, field: keyof ServicePort, value: string) => {
    const newPorts = [...ports];
    (newPorts[index] as any)[field] = value;
    setPorts(newPorts);
  };

  return (
    <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
      <div className='px-4 space-y-6'>
        <div>
          <Subheading className='mb-4'>Metadata</Subheading>
          
          <Field>
            <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
            <Description>
              Enter a unique name for your service.
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
              Select the namespace for this service.
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
          <Subheading className='mb-4'>Service Spec</Subheading>
          
          <Field>
            <Label>Type</Label>
            <Description>
              Select the service type.
            </Description>
            <Dropdown
              name="type"
              value={type}
              onChange={(value) => setType(value)}
              disabled={isEdit}
              options={[
                { value: 'ClusterIP', label: 'ClusterIP' },
                { value: 'NodePort', label: 'NodePort' },
                { value: 'LoadBalancer', label: 'LoadBalancer' },
                { value: 'ExternalName', label: 'ExternalName' }
              ] as DropdownOption<'ClusterIP' | 'NodePort' | 'LoadBalancer' | 'ExternalName'>[]}
            />
          </Field>

          {type !== 'ExternalName' && (
            <div>
              <p className="text-sm font-medium mb-2">Selector</p>
              <FieldLabels labels={selector} setLabels={setSelector} />
            </div>
          )}

          {type === 'ExternalName' && (
            <Field>
              <Label>External Name</Label>
              <Description>
                The external reference that this service maps to.
              </Description>
              <Input 
                name="externalName" 
                value={externalName} 
                onChange={(event) => setExternalName(event.target.value)} 
                placeholder="e.g., example.com" 
              />
            </Field>
          )}

          {type === 'LoadBalancer' && (
            <Field>
              <Label>Load Balancer IP</Label>
              <Description>
                Optional: Request a specific IP for the load balancer.
              </Description>
              <Input 
                name="loadBalancerIP" 
                value={loadBalancerIP} 
                onChange={(event) => setLoadBalancerIP(event.target.value)} 
                placeholder="e.g., 10.0.0.100" 
              />
            </Field>
          )}

          <Field>
            <Label>Session Affinity</Label>
            <Description>
              Route requests from the same client to the same pod.
            </Description>
            <Dropdown
              name="sessionAffinity"
              value={sessionAffinity}
              onChange={(value) => setSessionAffinity(value)}
              options={[
                { value: 'None', label: 'None' },
                { value: 'ClientIP', label: 'ClientIP' }
              ] as DropdownOption<'None' | 'ClientIP'>[]}
            />
          </Field>

          {(type === 'NodePort' || type === 'LoadBalancer') && (
            <Field>
              <Label>External Traffic Policy</Label>
              <Description>
                Control how external traffic is distributed.
              </Description>
              <Dropdown
                name="externalTrafficPolicy"
                value={externalTrafficPolicy}
                onChange={(value) => setExternalTrafficPolicy(value)}
                options={[
                  { value: 'Cluster', label: 'Cluster' },
                  { value: 'Local', label: 'Local' }
                ] as DropdownOption<'Cluster' | 'Local'>[]}
              />
            </Field>
          )}
        </div>

        <div>
          <Subheading className='mb-4'>Ports</Subheading>
          <div className="space-y-3">
            {ports.map((port, index) => (
              <div key={index} className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <div className="grid grid-cols-4 gap-2 items-center">
                  <div className="col-span-3">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <Input
                        placeholder="Port name (optional)"
                        value={port.name}
                        onChange={(e) => handlePortChange(index, 'name', e.target.value)}
                      />
                      <Dropdown
                        value={port.protocol}
                        onChange={(value) => handlePortChange(index, 'protocol', value)}
                        options={[
                          { value: 'TCP', label: 'TCP' },
                          { value: 'UDP', label: 'UDP' },
                          { value: 'SCTP', label: 'SCTP' }
                        ] as DropdownOption<'TCP' | 'UDP' | 'SCTP'>[]}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Input
                        type="number"
                        placeholder="Port"
                        value={port.port}
                        onChange={(e) => handlePortChange(index, 'port', e.target.value)}
                      />
                      <Input
                        placeholder="Target Port"
                        value={port.targetPort}
                        onChange={(e) => handlePortChange(index, 'targetPort', e.target.value)}
                      />
                      {type === 'NodePort' && (
                        <Input
                          type="number"
                          placeholder="Node Port"
                          value={port.nodePort}
                          onChange={(e) => handlePortChange(index, 'nodePort', e.target.value)}
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleRemovePort(index)}
                      disabled={ports.length === 1}
                      className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 disabled:opacity-50"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="secondary"
            onClick={handleAddPort}
            className="mt-3 w-full"
          >
            Add Port
          </Button>
        </div>
      </div>

      <div className='px-4'>
        <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>
      </div>
    </div>
  );
};