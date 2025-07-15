import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { ClusterRoleBadge } from '@components/access-control/cluster-role/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { Description, Field, Label } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Subheading } from '@components/base/heading';
import { CodePanel } from '@components/code';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { clusterRoleTemplate } from '@templates/clusterrole.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import helpObjects from '@help/index';
import { Checkbox } from '@components/base/checkbox';

interface Rule {
  apiGroups: string;
  resources: string;
  verbs: string[];
  resourceNames: string;
  nonResourceURLs: string;
}

export const ClusterRolesCreateView = (): JSX.Element => {
  const { setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [rules, setRules] = useState<Rule[]>([{
    apiGroups: '',
    resources: 'pods',
    verbs: ['get', 'list', 'watch'],
    resourceNames: '',
    nonResourceURLs: ''
  }]);
  const [useAggregation, setUseAggregation] = useState<boolean>(false);
  const [aggregationLabels, setAggregationLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);

  const allVerbs = ['get', 'list', 'watch', 'create', 'update', 'patch', 'delete', 'deletecollection'];
  
  const commonResources = [
    'pods', 'services', 'deployments', 'replicasets', 'statefulsets', 'daemonsets',
    'jobs', 'cronjobs', 'configmaps', 'secrets', 'persistentvolumeclaims',
    'persistentvolumes', 'storageclasses', 'ingresses', 'namespaces', 'nodes',
    'events', 'serviceaccounts', 'roles', 'rolebindings', 'clusterroles',
    'clusterrolebindings', 'networkpolicies', 'poddisruptionbudgets'
  ];

  const handleAddRule = () => {
    setRules([...rules, {
      apiGroups: '',
      resources: '',
      verbs: [],
      resourceNames: '',
      nonResourceURLs: ''
    }]);
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleRuleChange = (index: number, field: keyof Rule, value: any) => {
    const newRules = [...rules];
    (newRules[index] as any)[field] = value;
    setRules(newRules);
  };

  const handleVerbToggle = (index: number, verb: string) => {
    const newRules = [...rules];
    const verbs = newRules[index].verbs;
    if (verbs.includes(verb)) {
      newRules[index].verbs = verbs.filter(v => v !== verb);
    } else {
      newRules[index].verbs = [...verbs, verb];
    }
    setRules(newRules);
  };

  const handleAllVerbsToggle = (index: number) => {
    const newRules = [...rules];
    if (newRules[index].verbs.length === allVerbs.length) {
      newRules[index].verbs = [];
    } else {
      newRules[index].verbs = [...allVerbs];
    }
    setRules(newRules);
  };

  const parseRules = () => {
    return rules
      .filter(rule => rule.resources || rule.nonResourceURLs)
      .map(rule => ({
        apiGroups: rule.apiGroups ? rule.apiGroups.split(',').map(g => g.trim()) : [''],
        resources: rule.resources ? rule.resources.split(',').map(r => r.trim()) : [],
        verbs: rule.verbs,
        ...(rule.resourceNames && { 
          resourceNames: rule.resourceNames.split(',').map(n => n.trim()).filter(n => n) 
        }),
        ...(rule.nonResourceURLs && { 
          nonResourceURLs: rule.nonResourceURLs.split(',').map(u => u.trim()).filter(u => u) 
        })
      }));
  };

  const parseAggregationRule = () => {
    if (!useAggregation) return undefined;
    
    const matchLabels = aggregationLabels.reduce((acc, label) => {
      if (label.key && label.value) {
        acc[label.key] = label.value;
      }
      return acc;
    }, {} as Record<string, string>);

    if (Object.keys(matchLabels).length === 0) return undefined;

    return {
      clusterRoleSelectors: [{
        matchLabels
      }]
    };
  };

  const payload = clusterRoleTemplate({
    name,
    labels,
    annotations,
    rules: parseRules(),
    aggregationRule: parseAggregationRule()
  });

  const handleCreate = async () => {
    try {
      if (!useAggregation && rules.filter(r => r.resources || r.nonResourceURLs).length === 0) {
        setError("At least one rule must be specified.");
        return;
      }

      if (useAggregation && aggregationLabels.filter(l => l.key && l.value).length === 0) {
        setError("At least one aggregation label must be specified.");
        return;
      }

      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.ClusterRoles,
          action: ResourceAction.Details,
          name: name
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create cluster role.");
    }
  };

  return (
    <>
      <CreateHeader error={error}><ClusterRoleBadge />Create a New Cluster Role</CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <div className='px-4 space-y-6'>
          <div>
            <Subheading className='mb-4'>Metadata</Subheading>
            
            <Field>
              <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
              <Description>
                Enter a unique name for your cluster role.
              </Description>
              <Input 
                name="name" 
                value={name} 
                onChange={(event) => setName(event.target.value)} 
                placeholder="e.g., pod-reader" 
              />
            </Field>

            <FieldLabels labels={labels} setLabels={setLabels} />
            <FieldAnnotations annotations={annotations} setAnnotations={setAnnotations} />
          </div>

          <div>
            <Field>
              <Checkbox
                checked={useAggregation}
                onChange={setUseAggregation}
              >
                Use Aggregation Rule (combine other cluster roles)
              </Checkbox>
            </Field>
          </div>

          {useAggregation ? (
            <div>
              <Subheading className='mb-4'>Aggregation Rule</Subheading>
              <Description>
                This cluster role will aggregate permissions from other cluster roles matching these labels.
              </Description>
              <FieldLabels 
                labels={aggregationLabels} 
                setLabels={setAggregationLabels}
              />
            </div>
          ) : (
            <div>
              <Subheading className='mb-4'>Rules</Subheading>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Define what resources and actions this cluster role can access.
              </p>
              
              {rules.map((rule, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded p-3 mb-3">
                  <Field>
                    <Label>API Groups</Label>
                    <Description>
                      Comma-separated list of API groups (empty string for core API).
                    </Description>
                    <Input
                      value={rule.apiGroups}
                      onChange={(e) => handleRuleChange(index, 'apiGroups', e.target.value)}
                      placeholder='e.g., "", apps, batch'
                    />
                  </Field>

                  <Field>
                    <Label>Resources</Label>
                    <Description>
                      Comma-separated list of resources.
                    </Description>
                    <Input
                      value={rule.resources}
                      onChange={(e) => handleRuleChange(index, 'resources', e.target.value)}
                      placeholder="e.g., pods, services, deployments"
                      list={`resources-${index}`}
                    />
                    <datalist id={`resources-${index}`}>
                      {commonResources.map(resource => (
                        <option key={resource} value={resource} />
                      ))}
                    </datalist>
                  </Field>

                  <Field>
                    <Label>Resource Names (Optional)</Label>
                    <Description>
                      Comma-separated list of specific resource names.
                    </Description>
                    <Input
                      value={rule.resourceNames}
                      onChange={(e) => handleRuleChange(index, 'resourceNames', e.target.value)}
                      placeholder="e.g., my-configmap, my-secret"
                    />
                  </Field>

                  <Field>
                    <Label>Non-Resource URLs (Optional)</Label>
                    <Description>
                      Comma-separated list of non-resource URLs (e.g., /healthz).
                    </Description>
                    <Input
                      value={rule.nonResourceURLs}
                      onChange={(e) => handleRuleChange(index, 'nonResourceURLs', e.target.value)}
                      placeholder="e.g., /healthz, /metrics"
                    />
                  </Field>

                  <Field>
                    <Label>Verbs</Label>
                    <Description>
                      Actions allowed on the resources.
                    </Description>
                    <div className="space-y-2">
                      <Button
                        color="dark/white"
                        onClick={() => handleAllVerbsToggle(index)}
                        className="mb-2"
                      >
                        {rule.verbs.length === allVerbs.length ? 'Deselect All' : 'Select All'}
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        {allVerbs.map(verb => (
                          <Checkbox
                            key={verb}
                            checked={rule.verbs.includes(verb)}
                            onChange={() => handleVerbToggle(index, verb)}
                          >
                            {verb}
                          </Checkbox>
                        ))}
                      </div>
                    </div>
                  </Field>

                  <Button
                    color="red"
                    onClick={() => handleRemoveRule(index)}
                    disabled={rules.length === 1}
                  >
                    Remove Rule
                  </Button>
                </div>
              ))}
              
              <Button color="dark/white" onClick={handleAddRule}>
                Add Rule
              </Button>
            </div>
          )}
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