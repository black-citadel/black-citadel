import { useState, useEffect } from 'react';
import { useView } from '@context/viewProvider';
import { PodDisruptionBudgetBadge } from '@components/configuration/pod-disruption-budget/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku-bv/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { CodePanel } from '@components/code';
import { podDisruptionBudgetTemplate } from '@templates/poddisruptionbudget.yaml';
import { dump } from 'js-yaml';
import { PodDisruptionBudgetForm } from './_form';
import { V1PodDisruptionBudget } from '@utils/k8s-types';
import { FieldLabel } from '@components/form/field-labels';
import { Annotation as FieldAnnotation } from '@components/form/field-annotations';

interface MatchExpression {
  key: string;
  operator: 'In' | 'NotIn' | 'Exists' | 'DoesNotExist';
  values: string;
}

export const PodDisruptionBudgetsEditView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [_original, setOriginal] = useState<V1PodDisruptionBudget | null>(null);
  
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>('');
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [selectorType, setSelectorType] = useState<'matchLabels' | 'matchExpressions'>('matchLabels');
  const [matchLabels, setMatchLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [matchExpressions, setMatchExpressions] = useState<MatchExpression[]>([{ key: '', operator: 'In', values: '' }]);
  const [disruptionType, setDisruptionType] = useState<'minAvailable' | 'maxUnavailable'>('minAvailable');
  const [minAvailable, setMinAvailable] = useState<string>('1');
  const [maxUnavailable, setMaxUnavailable] = useState<string>('1');

  useEffect(() => {
    const fetchPDB = async () => {
      try {
        const pdb = await window.electronAPI.readNamespacedPodDisruptionBudget(viewContext.name, viewContext.namespace);
        setOriginal(pdb);
        
        setName(pdb.metadata.name || '');
        setNamespace(pdb.metadata.namespace || '');
        
        const labelEntries = Object.entries(pdb.metadata.labels || {});
        setLabels(labelEntries.length > 0 ? labelEntries.map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }]);
        
        const annotationEntries = Object.entries(pdb.metadata.annotations || {});
        setAnnotations(annotationEntries.length > 0 ? annotationEntries.map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }]);
        
        if (pdb.spec?.selector) {
          if (pdb.spec.selector.matchLabels) {
            setSelectorType('matchLabels');
            const matchLabelEntries = Object.entries(pdb.spec.selector.matchLabels);
            setMatchLabels(matchLabelEntries.length > 0 ? matchLabelEntries.map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }]);
          } else if (pdb.spec.selector.matchExpressions) {
            setSelectorType('matchExpressions');
            const expressions = pdb.spec.selector.matchExpressions.map((expr: any) => ({
              key: expr.key || '',
              operator: expr.operator || 'In',
              values: expr.values ? expr.values.join(', ') : ''
            }));
            setMatchExpressions(expressions.length > 0 ? expressions : [{ key: '', operator: 'In', values: '' }]);
          }
        }
        
        if (pdb.spec?.minAvailable !== undefined) {
          setDisruptionType('minAvailable');
          setMinAvailable(pdb.spec.minAvailable.toString());
        } else if (pdb.spec?.maxUnavailable !== undefined) {
          setDisruptionType('maxUnavailable');
          setMaxUnavailable(pdb.spec.maxUnavailable.toString());
        }
        
        setLoading(false);
      } catch (e) {
        console.error("Failed to fetch PDB:", e);
        setError("Failed to fetch pod disruption budget for editing.");
        setLoading(false);
      }
    };

    fetchPDB();
  }, [viewContext.name, viewContext.namespace]);

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

  const handleUpdate = async () => {
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
      setError("Failed to update pod disruption budget.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.PodDisruptionBudgets,
      action: ResourceAction.Details,
      name: viewContext.name,
      namespace: viewContext.namespace
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CreateHeader 
        error={error}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
            <Button variant="primary" onClick={() => handleUpdate()}>Update</Button>
          </div>
        }
      >
        <PodDisruptionBudgetBadge />Edit Pod Disruption Budget: {name}
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
          isEdit={true}
        />

        <div className='px-4'>
          <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>
        </div>
      </div>
    </>
  );
};