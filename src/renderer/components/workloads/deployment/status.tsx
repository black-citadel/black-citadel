import k8s = require('@kubernetes/client-node');
import { Subheading } from '@components/base/heading';
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@components/base/table';
import { DetailsItem } from '@components/details-item';

interface Props {
  status: k8s.V1DeploymentStatus;
}

export const DeploymentStatus = ({ status }: Props): JSX.Element => {
  return (
    <>
      <Subheading className='mt-8 mb-4'>Status</Subheading>

      <div className="grid grid-cols-5 gap-4">
        <DetailsItem label="Replicas">
          {status.replicas}
        </DetailsItem>

        <DetailsItem label="Updated Replicas">
          {status.updatedReplicas}
        </DetailsItem>

        <DetailsItem label="Ready Replicas">
          {status.readyReplicas}
        </DetailsItem>

        <DetailsItem label="Available Replicas">
          {status.availableReplicas}
        </DetailsItem>

        <DetailsItem label="Unavailable Replicas">
          {status.unavailableReplicas}
        </DetailsItem>
      </div >

      <Subheading className='mt-8 mb-4 text-sm'>
        <span title="Condition describes the state of a deployment at a certain point." className='cursor-help'>
          Conditions
        </span>
      </Subheading>
      <Table className='m-2'>
        <TableHead>
          <TableRow>
            <TableHeader>
              <span title="Last time the condition transitioned from one status to another." className='cursor-help'>
                Last Transition Time
              </span>
            </TableHeader>
            <TableHeader>
              <span title="The last time this condition was updated." className='cursor-help'>
                Last Update Time
              </span>
            </TableHeader>
            <TableHeader>
              <span title="A human readable message indicating details about the transition." className='cursor-help'>
                Message
              </span>
            </TableHeader>
            <TableHeader>
              <span title="The reason for the condition's last transition." className='cursor-help'>
                Reason
              </span></TableHeader>
            <TableHeader>
              <span title="Status of the condition, one of True, False, Unknown." className='cursor-help'>
                Status
              </span>
            </TableHeader>
            <TableHeader>
              <span title="Type of deployment condition." className='cursor-help'>
                Type
              </span>
            </TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {status.conditions.map((condition, index) => (
            <TableRow key={index}>
              <TableCell>{condition.lastTransitionTime.toLocaleString()}</TableCell>
              <TableCell>{condition.lastUpdateTime.toLocaleString()}</TableCell>
              <TableCell>{condition.message}</TableCell>
              <TableCell>{condition.reason}</TableCell>
              <TableCell>{condition.status}</TableCell>
              <TableCell>{condition.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};