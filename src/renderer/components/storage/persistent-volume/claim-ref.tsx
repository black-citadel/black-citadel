import k8s = require('@kubernetes/client-node');
import { DetailsItem } from "@components/details-item";

interface ClaimRefProps {
    claimRef?: k8s.V1ObjectReference;
  }
  
  export const ClaimRef = ({ claimRef }: ClaimRefProps): JSX.Element => {
    if (!claimRef) {
      return <DetailsItem label="Claim Reference">Not bound</DetailsItem>;
    }
  
    return (
      <DetailsItem label="Claim Reference">
        <div>Name: {claimRef.name}</div>
        <div>Namespace: {claimRef.namespace}</div>
        <div>UID: {claimRef.uid}</div>
      </DetailsItem>
    );
  };