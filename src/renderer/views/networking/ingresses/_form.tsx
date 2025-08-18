import { useState, useEffect } from 'react';
import { V1Ingress } from '@utils/k8s-types';
import { Field, Label, Description } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Dropdown } from '@components/base/dropdown';
import { Subheading } from '@components/base/heading';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { ingressTemplate } from '@templates/ingress.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import { NamespaceSelect } from '@components/form/field-namespace-select';
import helpObjects from '@help/index';
import { CodePanel } from '@components/code';
import { Button } from '@protoku-bv/design-system';
import { TrashIcon } from '@heroicons/react/24/outline';

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

interface IngressFormProps {
  ingress?: V1Ingress | null;
  onChange: (ingress: any) => void;
  isEdit?: boolean;
}

export const IngressForm = ({ ingress, onChange, isEdit = false }: IngressFormProps): JSX.Element => {
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>('default');
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

  useEffect(() => {
    if (ingress) {
      setName(ingress.metadata?.name || '');
      setNamespace(ingress.metadata?.namespace || 'default');
      
      if (ingress.metadata?.labels) {
        setLabels(Object.entries(ingress.metadata.labels).map(([key, value]) => ({ key, value })));
      }
      
      if (ingress.metadata?.annotations) {
        setAnnotations(Object.entries(ingress.metadata.annotations).map(([key, value]) => ({ key, value })));
      }

      setClassName(ingress.spec?.ingressClassName || '');

      if (ingress.spec?.rules) {
        setRules(ingress.spec.rules.map(rule => ({
          host: rule.host || '',
          paths: rule.http?.paths?.map(path => ({
            path: path.path || '/',
            pathType: (path.pathType as any) || 'Prefix',
            serviceName: path.backend?.service?.name || '',
            servicePort: String(path.backend?.service?.port?.number || path.backend?.service?.port?.name || '80')
          })) || []
        })));
      }

      if (ingress.spec?.tls) {
        setEnableTls(true);
        setTls(ingress.spec.tls.map(t => ({
          hosts: t.hosts?.join(', ') || '',
          secretName: t.secretName || ''
        })));
      }
    }
  }, [ingress]);

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

  useEffect(() => {
    onChange(payload);
  }, [name, namespace, labels, annotations, className, rules, tls, enableTls]);

  return (
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
              disabled={isEdit}
            />
          </Field>

          <Field>
            <Label>Namespace</Label>
            <Description>
              Select the namespace for this ingress.
            </Description>
            <NamespaceSelect 
              value={namespace} 
              onChange={setNamespace}
              disabled={isEdit}
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
          <div className="space-y-3">
            {rules.map((rule, ruleIndex) => (
              <div key={ruleIndex} className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <Field className="flex-1 mb-0">
                    <Label>Host</Label>
                    <Input
                      value={rule.host}
                      onChange={(e) => handleRuleChange(ruleIndex, 'host', e.target.value)}
                      placeholder="e.g., example.com"
                    />
                  </Field>
                  <button
                    onClick={() => handleRemoveRule(ruleIndex)}
                    disabled={rules.length === 1}
                    className="ml-3 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 disabled:opacity-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
                
                <p className="text-sm font-medium mb-2">Paths</p>
                <div className="space-y-2 pl-4">
                  {rule.paths.map((path, pathIndex) => (
                    <div key={pathIndex} className="flex items-start space-x-2">
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <div>
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
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Input
                            placeholder="Service Name"
                            value={path.serviceName}
                            onChange={(e) => handlePathChange(ruleIndex, pathIndex, 'serviceName', e.target.value)}
                          />
                          <Input
                            placeholder="Service Port"
                            value={path.servicePort}
                            onChange={(e) => handlePathChange(ruleIndex, pathIndex, 'servicePort', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemovePath(ruleIndex, pathIndex)}
                        disabled={rule.paths.length === 1}
                        className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 disabled:opacity-50"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="secondary" 
                  onClick={() => handleAddPath(ruleIndex)}
                  className="mt-2 w-full"
                >
                  Add Path
                </Button>
              </div>
            ))}
          </div>
          <Button 
            variant="secondary" 
            onClick={handleAddRule}
            className="mt-3 w-full"
          >
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
            <div className="space-y-3">
              {tls.map((t, index) => (
                <div key={index} className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-1">
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
                    </div>
                    <button
                      onClick={() => handleRemoveTls(index)}
                      disabled={tls.length === 1}
                      className="ml-3 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 disabled:opacity-50"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              <Button 
                variant="secondary" 
                onClick={handleAddTls}
                className="w-full"
              >
                Add TLS Entry
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className='px-4'>
        <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>
      </div>
    </div>
  );
};