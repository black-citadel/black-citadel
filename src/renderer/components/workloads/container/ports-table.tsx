import type { V1ContainerPort } from '@kubernetes/client-node';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@protoku-bv/design-system';

interface Props {
  ports: V1ContainerPort[];
}

export const ContainerPortsTable = ({ ports }: Props): JSX.Element => {
  const hasHost = ports.some((port) => port.hostPort || port.hostIP);

  return (
    <Table dense>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Port</TableHeader>
          <TableHeader>Protocol</TableHeader>
          {hasHost && <TableHeader>Host</TableHeader>}
        </TableRow>
      </TableHead>
      <TableBody>
        {ports.map((port, index) => (
          <TableRow key={index}>
            <TableCell>{port.name ?? <span className="text-zinc-500">unnamed</span>}</TableCell>
            <TableCell className="font-mono text-xs">{port.containerPort}</TableCell>
            <TableCell>{port.protocol ?? 'TCP'}</TableCell>
            {hasHost && (
              <TableCell className="font-mono text-xs">
                {port.hostIP ?? ''}{port.hostIP && port.hostPort ? ':' : ''}{port.hostPort ?? ''}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
