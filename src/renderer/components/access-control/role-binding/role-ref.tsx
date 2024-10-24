import { DetailsItem } from '@components/details-item';
import k8s = require('@kubernetes/client-node');

interface RoleRefProps {
    roleRef: k8s.V1RoleRef;
  }
  
  export const RoleRef = ({ roleRef }: RoleRefProps): JSX.Element => {
    return (
      <DetailsItem label="Role Reference">
        <div>API Group: {roleRef.apiGroup}</div>
        <div>Kind: {roleRef.kind}</div>
        <div>Name: {roleRef.name}</div>
      </DetailsItem>
    );
  };