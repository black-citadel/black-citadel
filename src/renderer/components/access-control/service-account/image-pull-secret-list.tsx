import { DetailsItem } from '@components/details-item';
import k8s = require('@kubernetes/client-node');

interface ImagePullSecretListProps {
    imagePullSecrets?: k8s.V1LocalObjectReference[];
  }
  
  export const ImagePullSecretList = ({ imagePullSecrets }: ImagePullSecretListProps): JSX.Element => {
    if (!imagePullSecrets || imagePullSecrets.length === 0) {
      return <DetailsItem label="Image Pull Secrets">None</DetailsItem>;
    }
  
    return (
      <DetailsItem label="Image Pull Secrets">
        {imagePullSecrets.map((secret, index) => (
          <div key={index} className="mb-1">
            {secret.name}
          </div>
        ))}
      </DetailsItem>
    );
  };