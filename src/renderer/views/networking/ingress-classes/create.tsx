import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { IngressClassBadge } from '@components/networking/ingress-class/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@components/base/button';
import { ResourceAction, Resources } from '@utils/enums';
import { Description, Field, Label } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Select } from '@components/base/select';
import { Subheading } from '@components/base/heading';
import { CodePanel } from '@components/code';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { ingressClassTemplate } from '@templates/ingressclass.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import helpObjects from '@help/index';
import { Checkbox } from '@components/base/checkbox';
import { NamespaceDropdown } from '@components/namespace-dropdown';

export const IngressClassesCreateView = (): JSX.Element => {
  const { setViewContext, activeNamespace } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [controller, setController] = useState<string>('');
  const [controllerType, setControllerType] = useState<string>('custom');
  const [isDefault, setIsDefault] = useState<boolean>(false);
  const [useParameters, setUseParameters] = useState<boolean>(false);
  const [paramApiGroup, setParamApiGroup] = useState<string>('');
  const [paramKind, setParamKind] = useState<string>('');
  const [paramName, setParamName] = useState<string>('');
  const [paramNamespace, setParamNamespace] = useState<string>(activeNamespace === 'all' ? '' : activeNamespace);
  const [paramScope, setParamScope] = useState<'Cluster' | 'Namespace'>('Cluster');

  const commonControllers = {
    'k8s.io/ingress-nginx': 'NGINX Ingress Controller',
    'traefik.io/ingress-controller': 'Traefik',
    'projectcontour.io/ingress-controller': 'Contour',
    'haproxy.org/ingress-controller': 'HAProxy',
    'kubernetes.io/ingress-gce': 'GCE',
    'kubernetes.io/ingress-aws-alb': 'AWS ALB',
    'ingress.k8s.aws/alb': 'AWS Load Balancer Controller',
    'voyager.appscode.com/ingress-controller': 'Voyager',
    'citrix.com/ingress-controller': 'Citrix',
    'f5.com/ingress-controller': 'F5 BIG-IP',
    'kong/ingress-controller': 'Kong'
  };

  const handleControllerTypeChange = (type: string) => {
    setControllerType(type);
    if (type !== 'custom') {
      setController(type);
    }
  };

  let payload = ingressClassTemplate({
    name,
    labels,
    annotations,
    controller,
    isDefault,
    parameters: useParameters && paramKind && paramName ? {
      apiGroup: paramApiGroup || undefined,
      kind: paramKind,
      name: paramName,
      namespace: paramNamespace || undefined,
      scope: paramScope
    } : undefined
  });

  const handleCreate = async () => {
    try {
      if (!controller) {
        setError("Controller is required.");
        return;
      }

      if (useParameters && (!paramKind || !paramName)) {
        setError("Parameters kind and name are required when parameters are enabled.");
        return;
      }

      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.IngressClasses,
          action: ResourceAction.Details,
          name: name
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create ingress class.");
    }
  };

  return (
    <>
      <CreateHeader error={error}><IngressClassBadge />Create a New Ingress Class</CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <div className='px-4 space-y-6'>
          <div>
            <Subheading className='mb-4'>Metadata</Subheading>
            
            <Field>
              <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
              <Description>
                Enter a unique name for your ingress class.
              </Description>
              <Input 
                name="name" 
                value={name} 
                onChange={(event) => setName(event.target.value)} 
                placeholder="e.g., nginx" 
              />
            </Field>

            <Field>
              <Checkbox
                checked={isDefault}
                onChange={setIsDefault}
              >
                Set as default ingress class
              </Checkbox>
              <Description className="mt-1">
                Ingresses without ingressClassName will use this class.
              </Description>
            </Field>

            <FieldLabels labels={labels} setLabels={setLabels} />
            <FieldAnnotations annotations={annotations} setAnnotations={setAnnotations} />
          </div>

          <div>
            <Subheading className='mb-4'>Controller</Subheading>
            
            <Field>
              <Label>Controller Type</Label>
              <Select
                value={controllerType}
                onChange={(e) => handleControllerTypeChange(e.target.value)}
              >
                <option value="custom">Custom</option>
                {Object.entries(commonControllers).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </Field>

            {controllerType === 'custom' && (
              <Field>
                <Label>Controller <span className="text-red-500">*</span></Label>
                <Description>
                  The name of the controller that should handle this class.
                </Description>
                <Input 
                  name="controller" 
                  value={controller} 
                  onChange={(event) => setController(event.target.value)} 
                  placeholder="e.g., k8s.io/ingress-nginx" 
                />
              </Field>
            )}
          </div>

          <div>
            <Field>
              <Checkbox
                checked={useParameters}
                onChange={setUseParameters}
              >
                Configure Parameters
              </Checkbox>
              <Description className="mt-1">
                Reference to a resource containing additional configuration for the controller.
              </Description>
            </Field>

            {useParameters && (
              <div className="mt-4 space-y-4">
                <Field>
                  <Label>API Group</Label>
                  <Description>
                    API group of the referent (optional).
                  </Description>
                  <Input 
                    name="paramApiGroup" 
                    value={paramApiGroup} 
                    onChange={(event) => setParamApiGroup(event.target.value)} 
                    placeholder="e.g., k8s.example.com" 
                  />
                </Field>

                <Field>
                  <Label>Kind <span className="text-red-500">*</span></Label>
                  <Description>
                    Kind of the referent resource.
                  </Description>
                  <Input 
                    name="paramKind" 
                    value={paramKind} 
                    onChange={(event) => setParamKind(event.target.value)} 
                    placeholder="e.g., IngressParameters" 
                  />
                </Field>

                <Field>
                  <Label>Name <span className="text-red-500">*</span></Label>
                  <Description>
                    Name of the referent resource.
                  </Description>
                  <Input 
                    name="paramName" 
                    value={paramName} 
                    onChange={(event) => setParamName(event.target.value)} 
                    placeholder="e.g., my-parameters" 
                  />
                </Field>

                <Field>
                  <Label>Scope</Label>
                  <Select
                    value={paramScope}
                    onChange={(e) => setParamScope(e.target.value as 'Cluster' | 'Namespace')}
                  >
                    <option value="Cluster">Cluster</option>
                    <option value="Namespace">Namespace</option>
                  </Select>
                </Field>

                {paramScope === 'Namespace' && (
                  <Field>
                    <Label>Namespace</Label>
                    <Description>
                      Namespace of the referent (required for Namespace scope).
                    </Description>
                    <NamespaceDropdown 
                      value={paramNamespace} 
                      onChange={setParamNamespace}
                    />
                  </Field>
                )}
              </div>
            )}
          </div>
        </div>

        <div className='px-4'>
          <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>

          <div className="mt-4">
            <Button onClick={() => handleCreate()} color='white' className='uppercase'>Apply</Button>
          </div>
        </div>
      </div>
    </>
  );
};