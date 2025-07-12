import k8s = require('@kubernetes/client-node');
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/base/table';
import { ServiceBadge } from './badge';
import { PodBadge } from '@components/workloads/pod/badge';

interface ServicePortsProps {
  ports: k8s.V1ServicePort[]
}

export const ServicePorts = ({ ports }: ServicePortsProps): JSX.Element => {
  return (
    <Table dense>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Port</TableHeader>
          <TableHeader>Protocol</TableHeader>
          <TableHeader>TargetPort</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {ports.map((port, _index) => (
          <TableRow key={port.name}>
            <TableCell>{port.name}</TableCell>
            <TableCell><ServiceBadge />{port.port}</TableCell>
            <TableCell>{port.protocol}</TableCell>
            <TableCell><PodBadge />{port.targetPort}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}