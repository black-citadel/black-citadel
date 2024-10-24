import { DetailsItem } from '@components/details-item';
import k8s = require('@kubernetes/client-node');

interface SecretListProps {
    secrets?: k8s.V1ObjectReference[];
  }
  
  export const SecretList = ({ secrets }: SecretListProps): JSX.Element => {
    if (!secrets || secrets.length === 0) {
      return <DetailsItem label="Secrets">None</DetailsItem>;
    }
  
    return (
      <DetailsItem label="Secrets">
        {secrets.map((secret, index) => (
          <div key={index} className="mb-1">
            {secret.name}
          </div>
        ))}
      </DetailsItem>
    );
  };