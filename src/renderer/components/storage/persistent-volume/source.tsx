import k8s = require('@kubernetes/client-node');
import { DetailsItem } from "@components/details-item";

interface PersistentVolumeSourceProps {
    source: k8s.V1PersistentVolumeSpec;
  }
  
  export const PersistentVolumeSource = ({ source }: PersistentVolumeSourceProps): JSX.Element => {
    const getSourceType = () => {
      const sourceTypes = [
        'awsElasticBlockStore', 'azureDisk', 'azureFile', 'cephfs', 'cinder',
        'csi', 'fc', 'flexVolume', 'flocker', 'gcePersistentDisk', 'glusterfs',
        'hostPath', 'iscsi', 'local', 'nfs', 'photonPersistentDisk', 'portworxVolume',
        'quobyte', 'rbd', 'scaleIO', 'storageos', 'vsphereVolume'
      ];
  
      for (const type of sourceTypes) {
        if (source[type]) {
          return { type, details: source[type] };
        }
      }
  
      return { type: 'Unknown', details: null };
    };
  
    const { type, details } = getSourceType();
  
    return (
      <DetailsItem label="Volume Source">
        <div>Type: {type}</div>
        {details && <pre className="text-sm overflow-auto">{JSON.stringify(details, null, 2)}</pre>}
      </DetailsItem>
    );
  };