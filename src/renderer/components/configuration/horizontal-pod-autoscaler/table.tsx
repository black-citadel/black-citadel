import k8s = require('@kubernetes/client-node');
import { ListTable } from '@components/list-table';
import { calculateAge } from '@utils/helpers';
import { NamespaceResourceLink } from '@components/cluster/namespace/resource-link';
import { HorizontalPodAutoscalerResourceLink } from './resource-link';
import { useView } from '@context/viewProvider';

interface Props {
  hpas: k8s.V2HorizontalPodAutoscalerList;
}

export const HorizontalPodAutoscalerList = ({ hpas }: Props): JSX.Element => {
  const { activeNamespace } = useView();

  const headers = ['Name', 'Namespace', 'Reference', 'Targets', 'Min Pods', 'Max Pods', 'Replicas', 'Age'];

  const filteredHPAs = activeNamespace === "all" 
  ? hpas.items 
  : hpas.items.filter(hpa => hpa.metadata.namespace === activeNamespace);

  const processedRows = filteredHPAs.map(hpa => ({
    Name: <HorizontalPodAutoscalerResourceLink name={hpa.metadata.name} namespace={hpa.metadata.namespace} />,
    Namespace: <NamespaceResourceLink name={hpa.metadata.namespace} />,
    Reference: formatScaleTargetRef(hpa.spec?.scaleTargetRef),
    Targets: formatMetrics(hpa.spec?.metrics, hpa.status?.currentMetrics),
    'Min Pods': hpa.spec?.minReplicas || '-',
    'Max Pods': hpa.spec?.maxReplicas || '-',
    Replicas: `${hpa.status?.currentReplicas || '-'} / ${hpa.status?.desiredReplicas || '-'}`,
    Age: hpa.metadata.creationTimestamp 
      ? calculateAge(new Date(hpa.metadata.creationTimestamp))
      : 'N/A'
  }));

  return (
    <ListTable headers={headers} rows={processedRows} />
  );
};

// Helper function to format scale target reference
const formatScaleTargetRef = (ref: k8s.V2CrossVersionObjectReference | undefined): string => {
  if (!ref) return 'N/A';
  return `${ref.kind}/${ref.name}`;
};

// Helper function to format metrics
const formatMetrics = (
  specMetrics: k8s.V2MetricSpec[] | undefined, 
  currentMetrics: k8s.V2MetricStatus[] | undefined
): string => {
  if (!specMetrics || specMetrics.length === 0) return 'N/A';

  return specMetrics.map((metric, index) => {
    const current = currentMetrics?.[index];
    let metricString = '';

    switch (metric.type) {
      case 'Resource':
        if (metric.resource) {
          const target = metric.resource.target.type === 'Utilization' 
            ? `${metric.resource.target.averageUtilization}%` 
            : metric.resource.target.averageValue;
          const currentValue = current?.resource?.current.averageUtilization 
            ? `${current.resource.current.averageUtilization}%`
            : current?.resource?.current.averageValue;
          metricString = `${metric.resource.name} ${currentValue || '?'}/${target}`;
        }
        break;
      case 'Pods':
        if (metric.pods) {
          metricString = `${metric.pods.metric.name} ${current?.pods?.current.averageValue || '?'}/${metric.pods.target.averageValue}`;
        }
        break;
      case 'Object':
        if (metric.object) {
          metricString = `${metric.object.metric.name} ${current?.object?.current.value || '?'}/${metric.object.target.value}`;
        }
        break;
      case 'External':
        if (metric.external) {
          metricString = `${metric.external.metric.name} ${current?.external?.current.value || '?'}/${metric.external.target.value}`;
        }
        break;
    }

    return metricString;
  }).join(', ');
};