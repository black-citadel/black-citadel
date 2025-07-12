import { useState } from 'react';
import { useView } from '@context/viewProvider'
import { ServiceBadge } from '@components/networking/service/badge';
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
import { serviceTemplate } from '@templates/service.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import { NamespaceDropdown } from '@components/namespace-dropdown';
import helpObjects from '@help/index';

interface ServicePort {
  name?: string;
  port: string;
  targetPort: string;
  protocol: 'TCP' | 'UDP' | 'SCTP';
  nodePort?: string;
}

export const ServicesCreateView = (): JSX.Element => {
  const { setViewContext, activeNamespace } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>(activeNamespace === 'all' ? 'default' : activeNamespace);
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [type, setType] = useState<'ClusterIP' | 'NodePort' | 'LoadBalancer' | 'ExternalName'>('ClusterIP');
  const [selector, setSelector] = useState<FieldLabel[]>([{ key: 'app', value: '' }]);
  const [ports, setPorts] = useState<ServicePort[]>([{ name: '', port: '80', targetPort: '80', protocol: 'TCP' }]);
  const [sessionAffinity, setSessionAffinity] = useState<'None' | 'ClientIP'>('None');
  const [externalName, setExternalName] = useState<string>('');
  const [loadBalancerIP, setLoadBalancerIP] = useState<string>('');
  const [externalTrafficPolicy, setExternalTrafficPolicy] = useState<'Cluster' | 'Local'>('Cluster');

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

  const handleCreate = async () => {
    try {
      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.Services,
          action: ResourceAction.Details,
          name: name,
          namespace: namespace
        })
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create service.");
    }
  };

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
    <>
      <CreateHeader error={error}><ServiceBadge />Create a New Service</CreateHeader>

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
              />
            </Field>

            <Field>
              <Label>Namespace</Label>
              <Description>
                Select the namespace for this service.
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
            {ports.map((port, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded p-3 mb-3">
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
                <Button
                  color="red"
                  onClick={() => handleRemovePort(index)}
                  disabled={ports.length === 1}
                  className="mt-2"
                >
                  Remove Port
                </Button>
              </div>
            ))}
            <Button color="dark/white" onClick={handleAddPort}>
              Add Port
            </Button>
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