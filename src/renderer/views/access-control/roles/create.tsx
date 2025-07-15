import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { RoleBadge } from '@components/access-control/role/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { Description, Field, Label } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Subheading } from '@components/base/heading';
import { CodePanel } from '@components/code';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { roleTemplate } from '@templates/role.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import { NamespaceSelect } from '@components/form/field-namespace-select';
import helpObjects from '@help/index';

interface Rule {
  apiGroups: string;
  resources: string;
  verbs: string[];
  resourceNames: string;
}

export const RolesCreateView = (): JSX.Element => {
  const { setViewContext, activeNamespace } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>(activeNamespace === 'all' ? 'default' : activeNamespace);
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [rules, setRules] = useState<Rule[]>([{
    apiGroups: '',
    resources: '',
    verbs: [],
    resourceNames: ''
  }]);

  const allVerbs = ['get', 'list', 'watch', 'create', 'update', 'patch', 'delete', 'deletecollection'];
  const commonResources = [
    'pods', 'services', 'configmaps', 'secrets', 'deployments', 'replicasets', 
    'statefulsets', 'daemonsets', 'jobs', 'cronjobs', 'ingresses', 'persistentvolumeclaims'
  ];
  const commonApiGroups = ['', 'apps', 'batch', 'networking.k8s.io', 'rbac.authorization.k8s.io'];

  const handleAddRule = () => {
    setRules([...rules, {
      apiGroups: '',
      resources: '',
      verbs: [],
      resourceNames: ''
    }]);
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleRuleChange = (index: number, field: keyof Rule, value: string | string[]) => {
    const newRules = [...rules];
    (newRules[index] as any)[field] = value;
    setRules(newRules);
  };

  const handleVerbToggle = (ruleIndex: number, verb: string) => {
    const newRules = [...rules];
    if (newRules[ruleIndex].verbs.includes(verb)) {
      newRules[ruleIndex].verbs = newRules[ruleIndex].verbs.filter(v => v !== verb);
    } else {
      newRules[ruleIndex].verbs = [...newRules[ruleIndex].verbs, verb];
    }
    setRules(newRules);
  };

  const parseCommaSeparated = (value: string): string[] => {
    return value.split(',').map(v => v.trim()).filter(v => v);
  };

  const parsedRules = rules.map(rule => ({
    apiGroups: parseCommaSeparated(rule.apiGroups),
    resources: parseCommaSeparated(rule.resources),
    verbs: rule.verbs,
    resourceNames: rule.resourceNames ? parseCommaSeparated(rule.resourceNames) : undefined
  }));

  const payload = roleTemplate({
    name,
    namespace,
    labels,
    annotations,
    rules: parsedRules
  });

  const handleCreate = async () => {
    try {
      // Validate rules
      for (const rule of parsedRules) {
        if (rule.resources.length === 0) {
          setError("Each rule must specify at least one resource.");
          return;
        }
        if (rule.verbs.length === 0) {
          setError("Each rule must specify at least one verb.");
          return;
        }
      }

      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.Roles,
          action: ResourceAction.Details,
          name: name,
          namespace: namespace
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create role.");
    }
  };

  return (
    <>
      <CreateHeader error={error}><RoleBadge />Create a New Role</CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <div className='px-4 space-y-6'>
          <div>
            <Subheading className='mb-4'>Metadata</Subheading>
            
            <Field>
              <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
              <Description>
                Enter a unique name for your role.
              </Description>
              <Input 
                name="name" 
                value={name} 
                onChange={(event) => setName(event.target.value)} 
                placeholder="e.g., pod-reader" 
              />
            </Field>

            <Field>
              <Label>Namespace</Label>
              <Description>
                Select the namespace for this role.
              </Description>
              <NamespaceSelect 
                value={namespace} 
                onChange={setNamespace}
              />
            </Field>

            <FieldLabels labels={labels} setLabels={setLabels} />
            <FieldAnnotations annotations={annotations} setAnnotations={setAnnotations} />
          </div>

          <div>
            <Subheading className='mb-4'>Rules</Subheading>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Define the permissions this role grants. Each rule specifies API groups, resources, and allowed verbs.
            </p>
            
            {rules.map((rule, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded p-4 mb-4">
                <Field>
                  <Label>API Groups</Label>
                  <Description>
                    Comma-separated API groups (empty string for core API group).
                  </Description>
                  <Input
                    value={rule.apiGroups}
                    onChange={(e) => handleRuleChange(index, 'apiGroups', e.target.value)}
                    placeholder='e.g., "", apps, batch'
                  />
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Common API groups:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {commonApiGroups.map(group => (
                        <button
                          key={group || 'core'}
                          type="button"
                          onClick={() => {
                            const current = parseCommaSeparated(rule.apiGroups);
                            if (!current.includes(group)) {
                              handleRuleChange(index, 'apiGroups', [...current, group].filter(g => g !== undefined).join(', '));
                            }
                          }}
                          className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          {group || 'core'}
                        </button>
                      ))}
                    </div>
                  </div>
                </Field>

                <Field>
                  <Label>Resources <span className="text-red-500">*</span></Label>
                  <Description>
                    Comma-separated resource types.
                  </Description>
                  <Input
                    value={rule.resources}
                    onChange={(e) => handleRuleChange(index, 'resources', e.target.value)}
                    placeholder="e.g., pods, services, configmaps"
                  />
                  <div className="mt-2">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Common resources:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {commonResources.map(resource => (
                        <button
                          key={resource}
                          type="button"
                          onClick={() => {
                            const current = parseCommaSeparated(rule.resources);
                            if (!current.includes(resource)) {
                              handleRuleChange(index, 'resources', [...current, resource].join(', '));
                            }
                          }}
                          className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          {resource}
                        </button>
                      ))}
                    </div>
                  </div>
                </Field>

                <div>
                  <p className="text-sm font-medium mb-2">Verbs <span className="text-red-500">*</span></p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Select the operations allowed on the resources.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {allVerbs.map(verb => (
                      <label key={verb} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={rule.verbs.includes(verb)}
                          onChange={() => handleVerbToggle(index, verb)}
                          className="mr-2"
                        />
                        <span className="text-sm">{verb}</span>
                      </label>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRuleChange(index, 'verbs', allVerbs)}
                    className="text-sm text-blue-600 dark:text-blue-400 mt-2 hover:underline"
                  >
                    Select all verbs
                  </button>
                </div>

                <Field>
                  <Label>Resource Names (Optional)</Label>
                  <Description>
                    Comma-separated specific resource names to restrict access to.
                  </Description>
                  <Input
                    value={rule.resourceNames}
                    onChange={(e) => handleRuleChange(index, 'resourceNames', e.target.value)}
                    placeholder="e.g., my-configmap, my-secret"
                  />
                </Field>

                <Button
                  color="red"
                  onClick={() => handleRemoveRule(index)}
                  disabled={rules.length === 1}
                  className="mt-4"
                >
                  Remove Rule
                </Button>
              </div>
            ))}
            
            <Button color="dark/white" onClick={handleAddRule}>
              Add Rule
            </Button>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> Roles grant permissions within a specific namespace. For cluster-wide permissions, use ClusterRoles instead.
            </p>
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