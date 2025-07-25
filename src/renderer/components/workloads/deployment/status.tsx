import k8s = require('@kubernetes/client-node');
import { Subheading } from '@components/base/heading';
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@protoku/design-system';
import { DetailsItem } from '@components/details-item';
import { Container } from '@components/base/container';
import { ConditionsTable } from '@components/base/conditions-table';

interface Props {
  status: k8s.V1DeploymentStatus;
}

export const DeploymentStatus = ({ status }: Props): JSX.Element => {
  return (
    <>
      <Container title='Status'>

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

      </Container>

      {status.conditions && <ConditionsTable conditions={status.conditions} />}
    </>
  );
};