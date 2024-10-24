import k8s = require('@kubernetes/client-node');
import { DetailsItem } from "@components/details-item";

interface VolumeClaimTemplatesProps {
    templates?: k8s.V1PersistentVolumeClaim[];
  }
  
  export const VolumeClaimTemplates = ({ templates }: VolumeClaimTemplatesProps): JSX.Element => {
    if (!templates || templates.length === 0) {
      return <DetailsItem label="Volume Claim Templates">None</DetailsItem>;
    }
  
    return (
      <DetailsItem label="Volume Claim Templates">
        {templates.map((template, index) => (
          <div key={index} className="mb-2">
            <div>Name: {template.metadata.name}</div>
            <div>Access Modes: {template.spec.accessModes.join(', ')}</div>
            <div>Storage Class: {template.spec.storageClassName}</div>
            <div>Resources: {template.spec.resources.requests.storage}</div>
          </div>
        ))}
      </DetailsItem>
    );
  };