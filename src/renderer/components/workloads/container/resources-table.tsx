import type { V1ResourceRequirements } from '@kubernetes/client-node';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@protoku-bv/design-system';

interface Props {
  resources: V1ResourceRequirements;
}

// cpu and memory first, then whatever else the container asks for (ephemeral-storage, GPUs, ...)
const sortResources = (names: string[]): string[] => {
  const priority = ['cpu', 'memory'];
  return [...names].sort((a, b) => {
    const indexA = priority.indexOf(a);
    const indexB = priority.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });
};

export const ResourcesTable = ({ resources }: Props): JSX.Element => {
  const requests = resources.requests ?? {};
  const limits = resources.limits ?? {};
  const names = sortResources(Array.from(new Set([...Object.keys(requests), ...Object.keys(limits)])));

  return (
    <>
      {names.length > 0 && (
        <Table dense>
          <TableHead>
            <TableRow>
              <TableHeader>Resource</TableHeader>
              <TableHeader>Request</TableHeader>
              <TableHeader>Limit</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {names.map((name) => (
              <TableRow key={name}>
                <TableCell>{name}</TableCell>
                <TableCell className="font-mono text-xs">{requests[name] ?? <span className="text-zinc-500">—</span>}</TableCell>
                <TableCell className="font-mono text-xs">{limits[name] ?? <span className="text-zinc-500">—</span>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {resources.claims && resources.claims.length > 0 && (
        <div className="mt-3 text-sm">
          <span className="text-zinc-500">Claims: </span>
          {resources.claims.map((claim) => claim.name).join(', ')}
        </div>
      )}
    </>
  );
};
