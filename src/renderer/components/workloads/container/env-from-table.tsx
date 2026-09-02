import type { V1EnvFromSource } from '@kubernetes/client-node';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@protoku-bv/design-system';
import { ConfigMapResourceLink } from '@components/configuration/config-map/resource-link';
import { SecretResourceLink } from '@components/configuration/secret/resource-link';
import { useView } from '@context/viewProvider';

interface Props {
  envFrom: V1EnvFromSource[];
}

export const EnvFromTable = ({ envFrom }: Props): JSX.Element => {
  const { viewContext } = useView();
  const namespace = viewContext.namespace ?? '';
  const hasPrefix = envFrom.some((source) => source.prefix);

  return (
    <Table dense>
      <TableHead>
        <TableRow>
          <TableHeader>Source</TableHeader>
          {hasPrefix && <TableHeader>Prefix</TableHeader>}
        </TableRow>
      </TableHead>
      <TableBody>
        {envFrom.map((source, index) => {
          const ref = source.configMapRef ?? source.secretRef;
          return (
            <TableRow key={index}>
              <TableCell>
                <span className="inline-flex items-center gap-1">
                  {source.configMapRef && <ConfigMapResourceLink name={source.configMapRef.name ?? ''} namespace={namespace} />}
                  {source.secretRef && <SecretResourceLink name={source.secretRef.name ?? ''} namespace={namespace} />}
                  {ref?.optional && <span className="text-xs text-zinc-500">(optional)</span>}
                </span>
              </TableCell>
              {hasPrefix && <TableCell className="font-mono text-xs">{source.prefix ?? ''}</TableCell>}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
