import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { PodDisruptionBudgetBadge } from '@components/configuration/pod-disruption-budget/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { CodePanel } from '@components/code';
import { podDisruptionBudgetTemplate } from '@templates/poddisruptionbudget.yaml';
import { dump } from 'js-yaml';
import { PodDisruptionBudgetForm } from './_form';
import { FieldLabel } from '@components/form/field-labels';
import { FieldAnnotation } from '@components/form/field-annotations';

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

  const handleCancel = () => {
    setViewContext({
      resource: Resources.PodDisruptionBudgets,
      action: ResourceAction.List
    });
  };

  return (
    <>
      <CreateHeader 
        error={error}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
            <Button variant="primary" onClick={() => handleCreate()}>Apply</Button>
          </div>
        }
      >
        <PodDisruptionBudgetBadge />Create a New Pod Disruption Budget
      </CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <PodDisruptionBudgetForm
          name={name}
          setName={setName}
          namespace={namespace}
          setNamespace={setNamespace}
          labels={labels}
          setLabels={setLabels}
          annotations={annotations}
          setAnnotations={setAnnotations}
          selectorType={selectorType}
          setSelectorType={setSelectorType}
          matchLabels={matchLabels}
          setMatchLabels={setMatchLabels}
          matchExpressions={matchExpressions}
          setMatchExpressions={setMatchExpressions}
          disruptionType={disruptionType}
          setDisruptionType={setDisruptionType}
          minAvailable={minAvailable}
          setMinAvailable={setMinAvailable}
          maxUnavailable={maxUnavailable}
          setMaxUnavailable={setMaxUnavailable}
        />

        <div className='px-4'>
          <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>
        </div>
      </div>
    </>
  );
};