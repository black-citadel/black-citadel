
import k8s = require('@kubernetes/client-node');
import { DetailsItem } from '@components/details-item';

interface EndpointSliceEndpointsProps {
  endpoints: k8s.V1Endpoint[];
}

export const EndpointSliceEndpoints = ({ endpoints }: EndpointSliceEndpointsProps): JSX.Element => {
  return (
    <div>
      {endpoints.map((endpoint, index) => (
        <div key={index} className="mb-4">
          <h4 className="font-bold">Endpoint {index + 1}</h4>
          <DetailsItem label="Addresses">
            {endpoint.addresses.map((address, addrIndex) => (
              <div key={addrIndex}>{address}</div>
            ))}
          </DetailsItem>
          {endpoint.conditions && (
            <DetailsItem label="Conditions">
              <div>Ready: {endpoint.conditions.ready ? 'True' : 'False'}</div>
              <div>Serving: {endpoint.conditions.serving ? 'True' : 'False'}</div>
              <div>Terminating: {endpoint.conditions.terminating ? 'True' : 'False'}</div>
            </DetailsItem>
          )}
          {endpoint.hostname && (
            <DetailsItem label="Hostname">
              {endpoint.hostname}
            </DetailsItem>
          )}
          {endpoint.targetRef && (
            <DetailsItem label="Target Reference">
              <div>Kind: {endpoint.targetRef.kind}</div>
              <div>Name: {endpoint.targetRef.name}</div>
              <div>Namespace: {endpoint.targetRef.namespace}</div>
            </DetailsItem>
          )}
        </div>
      ))}
    </div>
  );
};