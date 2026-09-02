import type { V1VolumeMount } from '@kubernetes/client-node';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@protoku-bv/design-system';

interface Props {
  volumeMounts: V1VolumeMount[];
}

export const VolumeMountsTable = ({ volumeMounts }: Props): JSX.Element => {
  const hasSubPath = volumeMounts.some((mount) => mount.subPath || mount.subPathExpr);
  const hasPropagation = volumeMounts.some((mount) => mount.mountPropagation);

  return (
    <Table dense>
      <TableHead>
        <TableRow>
          <TableHeader>Volume</TableHeader>
          <TableHeader>Mount path</TableHeader>
          {hasSubPath && <TableHeader>Sub path</TableHeader>}
          <TableHeader>Access</TableHeader>
          {hasPropagation && <TableHeader>Propagation</TableHeader>}
        </TableRow>
      </TableHead>
      <TableBody>
        {volumeMounts.map((mount, index) => (
          <TableRow key={`${mount.name}-${index}`}>
            <TableCell>{mount.name}</TableCell>
            <TableCell className="font-mono text-xs">{mount.mountPath}</TableCell>
            {hasSubPath && <TableCell className="font-mono text-xs">{mount.subPath ?? mount.subPathExpr ?? ''}</TableCell>}
            <TableCell>
              {mount.readOnly ? 'read-only' : 'read-write'}
              {mount.recursiveReadOnly && <span className="text-xs text-zinc-500"> ({mount.recursiveReadOnly})</span>}
            </TableCell>
            {hasPropagation && <TableCell>{mount.mountPropagation ?? ''}</TableCell>}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
