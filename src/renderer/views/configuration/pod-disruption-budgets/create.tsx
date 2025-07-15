import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { PodDisruptionBudgetBadge } from '@components/configuration/pod-disruption-budget/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { Description, Field, Label } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Dropdown } from '@components/base/dropdown';
import { Subheading } from '@components/base/heading';
import { CodePanel } from '@components/code';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import { podDisruptionBudgetTemplate } from '@templates/poddisruptionbudget.yaml';
import { dump } from 'js-yaml';
import { HelpButton } from '@components/help-button';
import { NamespaceSelect } from '@components/form/field-namespace-select';
import helpObjects from '@help/index';

interface MatchExpression {
  key: string;
  operator: 'In' | 'NotIn' | 'Exists' | 'DoesNotExist';
  values: string;
}

export const PodDisruptionBudgetsCreateView = (): JSX.Element => {
  const { setViewContext, activeNamespace } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>(activeNamespace === 'all' ? 'default' : activeNamespace);
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [selectorType, setSelectorType] = useState<'matchLabels' | 'matchExpressions'>('matchLabels');
  const [matchLabels, setMatchLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [matchExpressions, setMatchExpressions] = useState<MatchExpression[]>([{ key: '', operator: 'In', values: '' }]);
  const [disruptionType, setDisruptionType] = useState<'minAvailable' | 'maxUnavailable'>('minAvailable');
  const [minAvailable, setMinAvailable] = useState<string>('1');
  const [maxUnavailable, setMaxUnavailable] = useState<string>('1');

  const handleAddMatchExpression = () => {
    setMatchExpressions([...matchExpressions, { key: '', operator: 'In', values: '' }]);
  };

  const handleRemoveMatchExpression = (index: number) => {
    setMatchExpressions(matchExpressions.filter((_, i) => i !== index));
  };

  const handleMatchExpressionChange = (index: number, field: keyof MatchExpression, value: string) => {
    const newExpressions = [...matchExpressions];
    (newExpressions[index] as any)[field] = value;
    setMatchExpressions(newExpressions);
  };

  const parseSelector = () => {
    if (selectorType === 'matchLabels') {
      const matchLabelsObject = matchLabels.reduce((acc, label) => {
        if (label.key && label.value) {
          acc[label.key] = label.value;
        }
        return acc;
      }, {} as Record<string, string>);
      return {
        matchLabels: Object.keys(matchLabelsObject).length > 0 ? matchLabelsObject : undefined
      };
    } else {
      const expressions = matchExpressions
        .filter(expr => expr.key)
        .map(expr => ({
          key: expr.key,
          operator: expr.operator,
          values: expr.values && ['In', 'NotIn'].includes(expr.operator) 
            ? expr.values.split(',').map(v => v.trim()).filter(v => v) 
            : undefined
        }));
      return {
        matchExpressions: expressions.length > 0 ? expressions : undefined
      };
    }
  };

  const payload = podDisruptionBudgetTemplate({
    name,
    namespace,
    labels,
    annotations,
    selector: parseSelector(),
    minAvailable: disruptionType === 'minAvailable' ? minAvailable : undefined,
    maxUnavailable: disruptionType === 'maxUnavailable' ? maxUnavailable : undefined
  });

  const handleCreate = async () => {
    try {
      const selector = parseSelector();
      if (!selector.matchLabels && !selector.matchExpressions) {
        setError("A pod selector must be specified.");
        return;
      }

      if (disruptionType === 'minAvailable' && !minAvailable) {
        setError("Min available must be specified.");
        return;
      }

      if (disruptionType === 'maxUnavailable' && !maxUnavailable) {
        setError("Max unavailable must be specified.");
        return;
      }

      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.PodDisruptionBudgets,
          action: ResourceAction.Details,
          name: name,
          namespace: namespace
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create pod disruption budget.");
    }
  };

  return (
    <>
      <CreateHeader error={error}><PodDisruptionBudgetBadge />Create a New Pod Disruption Budget</CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <div className='px-4 space-y-6'>
          <div>
            <Subheading className='mb-4'>Metadata</Subheading>
            
            <Field>
              <Label>Name <HelpButton title="Name" content={helpObjects.metadata.name.help} /></Label>
              <Description>
                Enter a unique name for your pod disruption budget.
              </Description>
              <Input 
                name="name" 
                value={name} 
                onChange={(event) => setName(event.target.value)} 
                placeholder="e.g., my-app-pdb" 
              />
            </Field>

            <Field>
              <Label>Namespace</Label>
              <Description>
                Select the namespace for this pod disruption budget.
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
            <Subheading className='mb-4'>Pod Selector</Subheading>
            
            <Field>
              <Label>Selector Type</Label>
              <Dropdown
                value={selectorType}
                onChange={(value) => setSelectorType(value as 'matchLabels' | 'matchExpressions')}
                options={[
                  { value: 'matchLabels', label: 'Match Labels' },
                  { value: 'matchExpressions', label: 'Match Expressions' }
                ]}
              />
            </Field>

            {selectorType === 'matchLabels' ? (
              <div>
                <div className="text-sm font-medium mb-2">Match Labels</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Pods must have all these labels to be selected.
                </p>
                <FieldLabels labels={matchLabels} setLabels={setMatchLabels} />
              </div>
            ) : (
              <div>
                <div className="text-sm font-medium mb-2">Match Expressions</div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Define expressions to select pods.
                </p>
                {matchExpressions.map((expr, index) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-700 rounded p-3 mb-3">
                    <Field>
                      <Label>Key</Label>
                      <Input
                        value={expr.key}
                        onChange={(e) => handleMatchExpressionChange(index, 'key', e.target.value)}
                        placeholder="e.g., app"
                      />
                    </Field>
                    <Field>
                      <Label>Operator</Label>
                      <Dropdown
                        value={expr.operator}
                        onChange={(value) => handleMatchExpressionChange(index, 'operator', value)}
                        options={[
                          { value: 'In', label: 'In' },
                          { value: 'NotIn', label: 'NotIn' },
                          { value: 'Exists', label: 'Exists' },
                          { value: 'DoesNotExist', label: 'DoesNotExist' }
                        ]}
                      />
                    </Field>
                    {['In', 'NotIn'].includes(expr.operator) && (
                      <Field>
                        <Label>Values (comma-separated)</Label>
                        <Input
                          value={expr.values}
                          onChange={(e) => handleMatchExpressionChange(index, 'values', e.target.value)}
                          placeholder="e.g., web,api"
                        />
                      </Field>
                    )}
                    <Button
                      color="red"
                      onClick={() => handleRemoveMatchExpression(index)}
                      disabled={matchExpressions.length === 1}
                    >
                      Remove Expression
                    </Button>
                  </div>
                ))}
                <Button color="dark/white" onClick={handleAddMatchExpression}>
                  Add Expression
                </Button>
              </div>
            )}
          </div>

          <div>
            <Subheading className='mb-4'>Disruption Budget</Subheading>
            
            <Field>
              <Label>Budget Type</Label>
              <Description>
                Choose whether to specify minimum available or maximum unavailable pods.
              </Description>
              <Dropdown
                value={disruptionType}
                onChange={(value) => setDisruptionType(value as 'minAvailable' | 'maxUnavailable')}
                options={[
                  { value: 'minAvailable', label: 'Min Available' },
                  { value: 'maxUnavailable', label: 'Max Unavailable' }
                ]}
              />
            </Field>

            {disruptionType === 'minAvailable' ? (
              <Field>
                <Label>Min Available <span className="text-red-500">*</span></Label>
                <Description>
                  Minimum number or percentage of pods that must remain available (e.g., 1 or 25%).
                </Description>
                <Input
                  value={minAvailable}
                  onChange={(e) => setMinAvailable(e.target.value)}
                  placeholder="e.g., 1 or 25%"
                />
              </Field>
            ) : (
              <Field>
                <Label>Max Unavailable <span className="text-red-500">*</span></Label>
                <Description>
                  Maximum number or percentage of pods that can be unavailable (e.g., 1 or 25%).
                </Description>
                <Input
                  value={maxUnavailable}
                  onChange={(e) => setMaxUnavailable(e.target.value)}
                  placeholder="e.g., 1 or 25%"
                />
              </Field>
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