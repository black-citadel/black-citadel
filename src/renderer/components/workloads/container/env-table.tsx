import type { V1EnvVar, V1EnvVarSource } from '@kubernetes/client-node';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@protoku-bv/design-system';
import { ConfigMapResourceLink } from '@components/configuration/config-map/resource-link';
import { SecretResourceLink } from '@components/configuration/secret/resource-link';
import { useView } from '@context/viewProvider';

interface Props {
  env: V1EnvVar[];
}

const Source = ({ valueFrom, namespace }: { valueFrom: V1EnvVarSource; namespace: string }): JSX.Element => {
  if (valueFrom.configMapKeyRef) {
    const ref = valueFrom.configMapKeyRef;
    return (
      <span className="inline-flex flex-wrap items-center gap-1">
        <ConfigMapResourceLink name={ref.name ?? ''} namespace={namespace} />
        <span className="text-zinc-500">›</span>
        <span className="font-mono text-xs">{ref.key}</span>
        {ref.optional && <span className="text-xs text-zinc-500">(optional)</span>}
      </span>
    );
  }
  if (valueFrom.secretKeyRef) {
    const ref = valueFrom.secretKeyRef;
    return (
      <span className="inline-flex flex-wrap items-center gap-1">
        <SecretResourceLink name={ref.name ?? ''} namespace={namespace} />
        <span className="text-zinc-500">›</span>
        <span className="font-mono text-xs">{ref.key}</span>
        {ref.optional && <span className="text-xs text-zinc-500">(optional)</span>}
      </span>
    );
  }
  if (valueFrom.fieldRef) {
    return (
      <span>
        <span className="text-zinc-500">field </span>
        <span className="font-mono text-xs">{valueFrom.fieldRef.fieldPath}</span>
      </span>
    );
  }
  if (valueFrom.resourceFieldRef) {
    const ref = valueFrom.resourceFieldRef;
    return (
      <span>
        <span className="text-zinc-500">resource </span>
        <span className="font-mono text-xs">
          {ref.containerName ? `${ref.containerName}/` : ''}{ref.resource}
        </span>
        {ref.divisor && !['0', '1'].includes(String(ref.divisor)) && (
          <span className="text-xs text-zinc-500"> ÷ {String(ref.divisor)}</span>
        )}
      </span>
    );
  }
  return <span className="text-zinc-500">unknown source</span>;
};

export const EnvTable = ({ env }: Props): JSX.Element => {
  const { viewContext } = useView();
  const namespace = viewContext.namespace ?? '';

  return (
    <Table dense>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Value</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {env.map((variable, index) => (
          <TableRow key={`${variable.name}-${index}`}>
            <TableCell className="font-mono text-xs">{variable.name}</TableCell>
            <TableCell>
              {variable.valueFrom
                ? <Source valueFrom={variable.valueFrom} namespace={namespace} />
                : <span className="font-mono text-xs break-all">{variable.value ?? ''}</span>}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
