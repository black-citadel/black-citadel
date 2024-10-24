import k8s = require('@kubernetes/client-node');
import { DetailsItem } from '@components/details-item';

interface EndpointSubsetsProps {
  subsets: k8s.V1EndpointSubset[];
}

export const EndpointSubsets = ({ subsets }: EndpointSubsetsProps): JSX.Element => {
  return (
    <div>
      {subsets.map((subset, index) => (
        <div key={index} className="mb-4">
          <h4 className="font-bold">Subset {index + 1}</h4>
          <DetailsItem label="Addresses">
            {subset.addresses?.map((address, addrIndex) => (
              <div key={addrIndex}>
                {address.ip} {address.hostname && `(${address.hostname})`}
              </div>
            ))}
          </DetailsItem>
          <DetailsItem label="Ports">
            {subset.ports?.map((port, portIndex) => (
              <div key={portIndex}>
                {port.port} ({port.protocol})
              </div>
            ))}
          </DetailsItem>
        </div>
      ))}
    </div>
  );
};