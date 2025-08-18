import { useState, useEffect } from 'react';
import { V1IngressClass } from '@utils/k8s-types';
import { Field, Label, Description } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Dropdown } from '@components/base/dropdown';
import { Subheading } from '@components/base/heading';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { ingressClassTemplate } from '@templates/ingressclass.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import helpObjects from '@help/index';
import { Checkbox } from '@components/base/checkbox';
import { NamespaceSelect } from '@components/form/field-namespace-select';
import { CodePanel } from '@components/code';

interface IngressClassFormProps {
  ingressClass?: V1IngressClass | null;
  onChange: (ingressClass: any) => void;
  isEdit?: boolean;
}

export const IngressClassForm = ({ ingressClass, onChange, isEdit = false }: IngressClassFormProps): JSX.Element => {
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
  const [paramNamespace, setParamNamespace] = useState<string>('');
  const [paramScope, setParamScope] = useState<'Cluster' | 'Namespace'>('Cluster');

  const commonControllers: Record<string, string> = {
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

  useEffect(() => {
    if (ingressClass) {
      setName(ingressClass.metadata?.name || '');
      
      if (ingressClass.metadata?.labels) {
        setLabels(Object.entries(ingressClass.metadata.labels).map(([key, value]) => ({ key, value })));
      }
      
      if (ingressClass.metadata?.annotations) {
        setAnnotations(Object.entries(ingressClass.metadata.annotations).map(([key, value]) => ({ key, value })));
        
        // Check if it's the default class
        if (ingressClass.metadata.annotations['ingressclass.kubernetes.io/is-default-class'] === 'true') {
          setIsDefault(true);
        }
      }

      setController(ingressClass.spec?.controller || '');
      
      // Determine controller type
      if (commonControllers[ingressClass.spec?.controller || '']) {
        setControllerType(ingressClass.spec?.controller || '');
      } else {
        setControllerType('custom');
      }

      if (ingressClass.spec?.parameters) {
        setUseParameters(true);
        setParamApiGroup(ingressClass.spec.parameters.apiGroup || '');
        setParamKind(ingressClass.spec.parameters.kind || '');
        setParamName(ingressClass.spec.parameters.name || '');
        setParamNamespace(ingressClass.spec.parameters.namespace || '');
        setParamScope((ingressClass.spec.parameters.scope as any) || 'Cluster');
      }
    }
  }, [ingressClass]);

  const handleControllerTypeChange = (type: string) => {
    setControllerType(type);
    if (type !== 'custom') {
      setController(type);
    }
  };

  const payload = ingressClassTemplate({
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

  useEffect(() => {
    onChange(payload);
  }, [name, labels, annotations, controller, isDefault, useParameters, paramApiGroup, paramKind, paramName, paramNamespace, paramScope]);

  return (
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
              disabled={isEdit}
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
            <Dropdown
              value={controllerType}
              onChange={(value) => handleControllerTypeChange(value)}
              disabled={isEdit}
              options={[
                { value: 'custom', label: 'Custom' },
                ...Object.entries(commonControllers).map(([value, label]) => ({
                  value,
                  label
                }))
              ]}
            />
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
                disabled={isEdit}
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
                <Dropdown
                  value={paramScope}
                  onChange={(value) => setParamScope(value as 'Cluster' | 'Namespace')}
                  options={[
                    { value: 'Cluster', label: 'Cluster' },
                    { value: 'Namespace', label: 'Namespace' }
                  ]}
                />
              </Field>

              {paramScope === 'Namespace' && (
                <Field>
                  <Label>Namespace</Label>
                  <Description>
                    Namespace of the referent (required for Namespace scope).
                  </Description>
                  <NamespaceSelect 
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
      </div>
    </div>
  );
};