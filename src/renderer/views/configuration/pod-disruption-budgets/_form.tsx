import { Field, Label, Description } from '@components/base/fieldset';
import { Input } from '@components/base/input';
import { Dropdown } from '@components/base/dropdown';
import { Subheading } from '@components/base/heading';
import { Button } from '@protoku-bv/design-system';
import { HelpButton } from '@components/help-button';
import { NamespaceSelect } from '@components/form/field-namespace-select';
import { FieldLabels, Label as FieldLabel } from '@components/form/field-labels';
import { FieldAnnotations, Annotation as FieldAnnotation } from '@components/form/field-annotations';
import helpObjects from '@help/index';

interface MatchExpression {
  key: string;
  operator: 'In' | 'NotIn' | 'Exists' | 'DoesNotExist';
  values: string;
}

interface PodDisruptionBudgetFormProps {
  name: string;
  setName: (name: string) => void;
  namespace: string;
  setNamespace: (namespace: string) => void;
  labels: FieldLabel[];
  setLabels: (labels: FieldLabel[]) => void;
  annotations: FieldAnnotation[];
  setAnnotations: (annotations: FieldAnnotation[]) => void;
  selectorType: 'matchLabels' | 'matchExpressions';
  setSelectorType: (type: 'matchLabels' | 'matchExpressions') => void;
  matchLabels: FieldLabel[];
  setMatchLabels: (labels: FieldLabel[]) => void;
  matchExpressions: MatchExpression[];
  setMatchExpressions: (expressions: MatchExpression[]) => void;
  disruptionType: 'minAvailable' | 'maxUnavailable';
  setDisruptionType: (type: 'minAvailable' | 'maxUnavailable') => void;
  minAvailable: string;
  setMinAvailable: (value: string) => void;
  maxUnavailable: string;
  setMaxUnavailable: (value: string) => void;
  isEdit?: boolean;
}

export const PodDisruptionBudgetForm = ({
  name,
  setName,
  namespace,
  setNamespace,
  labels,
  setLabels,
  annotations,
  setAnnotations,
  selectorType,
  setSelectorType,
  matchLabels,
  setMatchLabels,
  matchExpressions,
  setMatchExpressions,
  disruptionType,
  setDisruptionType,
  minAvailable,
  setMinAvailable,
  maxUnavailable,
  setMaxUnavailable,
  isEdit = false
}: PodDisruptionBudgetFormProps): JSX.Element => {
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

  return (
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
            disabled={isEdit}
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
            disabled={isEdit}
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
  );
};