import { useState } from 'react';
import { useView } from '@context/viewProvider';
import { LimitRangeBadge } from '@components/configuration/limit-range/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { CodePanel } from '@components/code';
import { limitRangeTemplate } from '@templates/limitrange.yaml';
import { dump } from 'js-yaml';
import { LimitRangeForm } from './_form';
import { FieldLabel } from '@components/form/field-labels';
import { FieldAnnotation } from '@components/form/field-annotations';

interface LimitItem {
  type: 'Pod' | 'Container' | 'PersistentVolumeClaim';
  max: { [key: string]: string };
  min: { [key: string]: string };
  default: { [key: string]: string };
  defaultRequest: { [key: string]: string };
  maxLimitRequestRatio: { [key: string]: string };
}

export const LimitRangesCreateView = (): JSX.Element => {
  const { setViewContext, activeNamespace } = useView();
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>(activeNamespace === 'all' ? 'default' : activeNamespace);
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [limits, setLimits] = useState<LimitItem[]>([{
    type: 'Container',
    max: { cpu: '1', memory: '1Gi' },
    min: { cpu: '100m', memory: '128Mi' },
    default: { cpu: '500m', memory: '512Mi' },
    defaultRequest: { cpu: '200m', memory: '256Mi' },
    maxLimitRequestRatio: {}
  }]);

  const cleanLimits = () => {
    return limits.map(limit => ({
      type: limit.type,
      max: Object.keys(limit.max).length > 0 ? limit.max : undefined,
      min: Object.keys(limit.min).length > 0 ? limit.min : undefined,
      default: Object.keys(limit.default).length > 0 ? limit.default : undefined,
      defaultRequest: Object.keys(limit.defaultRequest).length > 0 ? limit.defaultRequest : undefined,
      maxLimitRequestRatio: Object.keys(limit.maxLimitRequestRatio).length > 0 ? limit.maxLimitRequestRatio : undefined
    }));
  };

  const payload = limitRangeTemplate({
    name,
    namespace,
    labels,
    annotations,
    limits: cleanLimits()
  });

  const handleCreate = async () => {
    try {
      if (limits.length === 0) {
        setError("At least one limit must be specified.");
        return;
      }

      const yamlString = dump(payload);
      const result = await window.electronAPI.apply(yamlString);

      if (result.success) {
        setViewContext({
          resource: Resources.LimitRanges,
          action: ResourceAction.Details,
          name: name,
          namespace: namespace
        });
      } else {
        setError(result.error);
      }
    } catch (e) {
      console.log(e);
      setError("Failed to create limit range.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.LimitRanges,
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
        <LimitRangeBadge />Create a New Limit Range
      </CreateHeader>

      <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2 my-8">
        <LimitRangeForm
          name={name}
          setName={setName}
          namespace={namespace}
          setNamespace={setNamespace}
          labels={labels}
          setLabels={setLabels}
          annotations={annotations}
          setAnnotations={setAnnotations}
          limits={limits}
          setLimits={setLimits}
        />

        <div className='px-4'>
          <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>
        </div>
      </div>
    </>
  );
};