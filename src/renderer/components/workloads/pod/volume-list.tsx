import k8s = require('@kubernetes/client-node');
import { DetailsItem } from "@components/details-item";

interface VolumeListProps {
    volumes?: k8s.V1Volume[];
  }
  
  export const VolumeList = ({ volumes }: VolumeListProps): JSX.Element => {
    if (!volumes || volumes.length === 0) {
      return <DetailsItem label="Volumes">No volumes</DetailsItem>;
    }
    
    return (
      <DetailsItem label="Volumes">
        {volumes.map((volume, index) => (
          <div key={index} className="mb-2">
            <div>Name: {volume.name}</div>
            {volume.emptyDir && <div>Type: EmptyDir</div>}
            {volume.hostPath && <div>Type: HostPath, Path: {volume.hostPath.path}</div>}
            {volume.persistentVolumeClaim && <div>Type: PVC, Claim Name: {volume.persistentVolumeClaim.claimName}</div>}
            {/* Add more volume types as needed */}
          </div>
        ))}
      </DetailsItem>
    );
  };