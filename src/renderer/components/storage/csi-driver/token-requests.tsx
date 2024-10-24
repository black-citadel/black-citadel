import k8s = require('@kubernetes/client-node');
import { DetailsItem } from "@components/details-item";

interface TokenRequestsProps {
    requests?: k8s.StorageV1TokenRequest[];
  }
  
  export const TokenRequests = ({ requests }: TokenRequestsProps): JSX.Element => {
    if (!requests || requests.length === 0) {
      return <DetailsItem label="Token Requests">None</DetailsItem>;
    }
  
    return (
      <DetailsItem label="Token Requests">
        {requests.map((request, index) => (
          <div key={index} className="mb-2 p-2 border border-gray-200 rounded">
            <div>Audience: {request.audience}</div>
            <div>Expiration Seconds: {request.expirationSeconds}</div>
          </div>
        ))}
      </DetailsItem>
    );
  };