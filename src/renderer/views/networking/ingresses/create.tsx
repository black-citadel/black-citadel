import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { IngressBadge } from '@components/networking/ingress/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { Description, Field, Label } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Subheading } from '@components/base/heading';
import { CodePanel } from '@components/code';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { ingressTemplate } from '@templates/ingress.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import { NamespaceDropdown } from '@components/namespace-dropdown';
import helpObjects from '@help/index';

interface IngressPath {
  path: string;
  pathType: 'Prefix' | 'Exact' | 'ImplementationSpecific';
  serviceName: string;
  servicePort: string;
}

interface IngressRule {
  host: string;
  paths: IngressPath[];
}

interface IngressTLS {
  hosts: string;
  secretName: string;
}

export const IngressesCreateView = (): JSX.Element => {
  const { setViewContext, activeNamespace } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>(activeNamespace === 'all' ? 'default' : activeNamespace);
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [className, setClassName] = useState<string>('');
  const [rules, setRules] = useState<IngressRule[]>([{
    host: '',
    paths: [{
      path: '/',
      pathType: 'Prefix',
      serviceName: '',
      servicePort: '80'
    }]
  }]);
  const [tls, setTls] = useState<IngressTLS[]>([]);
  const [enableTls, setEnableTls] = useState<boolean>(false);

  const handleAddRule = () => {
    setRules([...rules, {
      host: '',
      paths: [{
        path: '/',
        pathType: 'Prefix',
        serviceName: '',
        servicePort: '80'
      }]
    }]);
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleRuleChange = (index: number, field: keyof IngressRule, value: string) => {
    const newRules = [...rules];
    if (field === 'host') {
      newRules[index].host = value;
    }
    setRules(newRules);
  };

  const handleAddPath = (ruleIndex: number) => {
    const newRules = [...rules];
    newRules[ruleIndex].paths.push({
      path: '/',
      pathType: 'Prefix',
      serviceName: '',
      servicePort: '80'
    });
    setRules(newRules);
  };

  const handleRemovePath = (ruleIndex: number, pathIndex: number) => {
    const newRules = [...rules];
    newRules[ruleIndex].paths = newRules[ruleIndex].paths.filter((_, i) => i !== pathIndex);
    setRules(newRules);
  };

  const handlePathChange = (ruleIndex: number, pathIndex: number, field: keyof IngressPath, value: string) => {
    const newRules = [...rules];
    (newRules[ruleIndex].paths[pathIndex] as any)[field] = value;
    setRules(newRules);
  };

  const handleAddTls = () => {
    setTls([...tls, { hosts: '', secretName: '' }]);
  };

  const handleRemoveTls = (index: number) => {
    setTls(tls.filter((_, i) => i !== index));
  };

  const handleTlsChange = (index: number, field: keyof IngressTLS, value: string) => {
    const newTls = [...tls];
    newTls[index][field] = value;
    setTls(newTls);
  };

  const parsedRules = rules.map(rule => ({
    ...rule,
    paths: rule.paths.map(path => ({
      ...path,
      servicePort: isNaN(parseInt(path.servicePort)) ? path.servicePort : parseInt(path.servicePort)
    }))
  }));

  const parsedTls = tls.map(t => ({
    hosts: t.hosts.split(',').map(h => h.trim()).filter(h => h),
    secretName: t.secretName
  }));

  const payload = ingressTemplate({
    name,
    namespace,
    labels,
    annotations,
    className: className || undefined,
    rules: parsedRules,
    tls: enableTls && parsedTls.length > 0 ? parsedTls : undefined
  });

  const handleCreate = async () => {
    try {
      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.Ingresses,
          action: ResourceAction.Details,
          name: name,
          namespace: namespace
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create ingress.");
    }
  };

  return (
    <>
      <CreateHeader error={error}><IngressBadge />Create a New Ingress</CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <div className='px-4 space-y-6'>
          <div>
            <Subheading className='mb-4'>Metadata</Subheading>
            
            <Field>
              <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
              <Description>
                Enter a unique name for your ingress.
              </Description>
              <Input 
                name="name" 
                value={name} 
                onChange={(event) => setName(event.target.value)} 
                placeholder="e.g., my-ingress" 
              />
            </Field>

            <Field>
              <Label>Namespace</Label>
              <Description>
                Select the namespace for this ingress.
              </Description>
              <NamespaceDropdown 
                value={namespace} 
                onChange={setNamespace}
              />
            </Field>

            <Field>
              <Label>Ingress Class Name</Label>
              <Description>
                The ingress controller to use (e.g., nginx, traefik).
              </Description>
              <Input 
                name="className" 
                value={className} 
                onChange={(event) => setClassName(event.target.value)} 
                placeholder="e.g., nginx" 
              />
            </Field>

            <FieldLabels labels={labels} setLabels={setLabels} />
            <FieldAnnotations annotations={annotations} setAnnotations={setAnnotations} />
          </div>

          <div>
            <Subheading className='mb-4'>Rules</Subheading>
            {rules.map((rule, ruleIndex) => (
              <div key={ruleIndex} className="border border-gray-200 dark:border-gray-700 rounded p-3 mb-3">
                <Field>
                  <Label>Host</Label>
                  <Input
                    value={rule.host}
                    onChange={(e) => handleRuleChange(ruleIndex, 'host', e.target.value)}
                    placeholder="e.g., example.com"
                  />
                </Field>
                
                <p className="text-sm font-medium mt-3 mb-2">Paths</p>
                {rule.paths.map((path, pathIndex) => (
                  <div key={pathIndex} className="border border-gray-100 dark:border-gray-800 rounded p-2 mb-2">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <Input
                        placeholder="Path"
                        value={path.path}
                        onChange={(e) => handlePathChange(ruleIndex, pathIndex, 'path', e.target.value)}
                      />
                      <Dropdown
                        value={path.pathType}
                        onChange={(value) => handlePathChange(ruleIndex, pathIndex, 'pathType', value)}
                        options={[
                          { value: 'Prefix', label: 'Prefix' },
                          { value: 'Exact', label: 'Exact' },
                          { value: 'ImplementationSpecific', label: 'ImplementationSpecific' }
                        ]}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Service Name"
                        value={path.serviceName}
                        onChange={(e) => handlePathChange(ruleIndex, pathIndex, 'serviceName', e.target.value)}
                      />
                      <Input
                        placeholder="Service Port"
                        value={path.servicePort}
                        onChange={(e) => handlePathChange(ruleIndex, pathIndex, 'servicePort', e.target.value)}
                      />
                    </div>
                    <Button
                      color="red"
                      onClick={() => handleRemovePath(ruleIndex, pathIndex)}
                      disabled={rule.paths.length === 1}
                      className="mt-2"
                    >
                      Remove Path
                    </Button>
                  </div>
                ))}
                <Button color="dark/white" onClick={() => handleAddPath(ruleIndex)}>
                  Add Path
                </Button>
                <Button
                  color="red"
                  onClick={() => handleRemoveRule(ruleIndex)}
                  disabled={rules.length === 1}
                  className="mt-2 ml-2"
                >
                  Remove Rule
                </Button>
              </div>
            ))}
            <Button color="dark/white" onClick={handleAddRule}>
              Add Rule
            </Button>
          </div>

          <div>
            <Subheading className='mb-4'>TLS</Subheading>
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={enableTls}
                  onChange={(e) => {
                    setEnableTls(e.target.checked);
                    if (e.target.checked && tls.length === 0) {
                      setTls([{ hosts: '', secretName: '' }]);
                    }
                  }}
                  className="mr-2"
                />
                <span className="text-sm font-medium">Enable TLS</span>
              </label>
            </div>
            
            {enableTls && (
              <>
                {tls.map((t, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded p-3 mb-3">
                    <Field>
                      <Label>Hosts</Label>
                      <Description>Comma-separated list of hosts</Description>
                      <Input
                        value={t.hosts}
                        onChange={(e) => handleTlsChange(index, 'hosts', e.target.value)}
                        placeholder="e.g., example.com, www.example.com"
                      />
                    </Field>
                    <Field>
                      <Label>Secret Name</Label>
                      <Description>TLS certificate secret</Description>
                      <Input
                        value={t.secretName}
                        onChange={(e) => handleTlsChange(index, 'secretName', e.target.value)}
                        placeholder="e.g., tls-secret"
                      />
                    </Field>
                    <Button
                      color="red"
                      onClick={() => handleRemoveTls(index)}
                      disabled={tls.length === 1}
                    >
                      Remove TLS
                    </Button>
                  </div>
                ))}
                <Button color="dark/white" onClick={handleAddTls}>
                  Add TLS Entry
                </Button>
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