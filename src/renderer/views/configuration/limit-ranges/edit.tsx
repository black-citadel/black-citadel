import { useState, useEffect } from 'react';
import { useView } from '@context/viewProvider';
import { LimitRangeBadge } from '@components/configuration/limit-range/badge';
import { CreateHeader } from '@components/create-header';
import { Button } from '@protoku/design-system';
import { ResourceAction, Resources } from '@utils/enums';
import { CodePanel } from '@components/code';
import { limitRangeTemplate } from '@templates/limitrange.yaml';
import { dump } from 'js-yaml';
import { LimitRangeForm } from './_form';
import { V1LimitRange } from '@utils/k8s-types';
import { FieldLabel } from '@components/form/field-labels';
import { Annotation as FieldAnnotation } from '@components/form/field-annotations';

interface LimitItem {
  type: 'Pod' | 'Container' | 'PersistentVolumeClaim';
  max: { [key: string]: string };
  min: { [key: string]: string };
  default: { [key: string]: string };
  defaultRequest: { [key: string]: string };
  maxLimitRequestRatio: { [key: string]: string };
}

export const LimitRangesEditView = (): JSX.Element => {
  const { viewContext, setViewContext } = useView();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [original, setOriginal] = useState<V1LimitRange | null>(null);
  
  const [name, setName] = useState<string>('');
  const [namespace, setNamespace] = useState<string>('');
  const [labels, setLabels] = useState<FieldLabel[]>([{ key: '', value: '' }]);
  const [annotations, setAnnotations] = useState<FieldAnnotation[]>([{ key: '', value: '' }]);
  const [limits, setLimits] = useState<LimitItem[]>([{
    type: 'Container',
    max: {},
    min: {},
    default: {},
    defaultRequest: {},
    maxLimitRequestRatio: {}
  }]);

  useEffect(() => {
    const fetchLimitRange = async () => {
      try {
        const limitRange = await window.electronAPI.readNamespacedLimitRange(viewContext.name, viewContext.namespace);
        setOriginal(limitRange);
        
        setName(limitRange.metadata.name || '');
        setNamespace(limitRange.metadata.namespace || '');
        
        const labelEntries = Object.entries(limitRange.metadata.labels || {});
        setLabels(labelEntries.length > 0 ? labelEntries.map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }]);
        
        const annotationEntries = Object.entries(limitRange.metadata.annotations || {});
        setAnnotations(annotationEntries.length > 0 ? annotationEntries.map(([key, value]) => ({ key, value })) : [{ key: '', value: '' }]);
        
        if (limitRange.spec?.limits) {
          const parsedLimits = limitRange.spec.limits.map((limit: any) => ({
            type: limit.type as 'Pod' | 'Container' | 'PersistentVolumeClaim',
            max: limit.max || {},
            min: limit.min || {},
            default: limit.default || {},
            defaultRequest: limit.defaultRequest || {},
            maxLimitRequestRatio: limit.maxLimitRequestRatio || {}
          }));
          setLimits(parsedLimits);
        }
        
        setLoading(false);
      } catch (e) {
        console.error("Failed to fetch limit range:", e);
        setError("Failed to fetch limit range for editing.");
        setLoading(false);
      }
    };

    fetchLimitRange();
  }, [viewContext.name, viewContext.namespace]);

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

  const handleUpdate = async () => {
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
      setError("Failed to update limit range.");
    }
  };

  const handleCancel = () => {
    setViewContext({
      resource: Resources.LimitRanges,
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
        <LimitRangeBadge />Edit Limit Range: {name}
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
          isEdit={true}
        />

        <div className='px-4'>
          <CodePanel code={dump(payload)}><code>{dump(payload)}</code></CodePanel>
        </div>
      </div>
    </>
  );
};