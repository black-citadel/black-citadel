import k8s = require('@kubernetes/client-node');
import { DetailsItem } from "@components/details-item";

interface PolicyRulesProps {
    ingress?: k8s.V1NetworkPolicyIngressRule[];
    egress?: k8s.V1NetworkPolicyEgressRule[];
  }
  
  export const PolicyRules = ({ ingress, egress }: PolicyRulesProps): JSX.Element => {
    return (
      <>
        {ingress && (
          <DetailsItem label="Ingress Rules">
            {ingress.map((rule, index) => (
              <div key={index} className="mb-2">
                <h4 className="font-bold">Rule {index + 1}</h4>
                {rule.from?.map((from, fromIndex) => (
                  <div key={fromIndex}>
                    {from.ipBlock && `IP Block: ${from.ipBlock.cidr}`}
                    {from.namespaceSelector && 'Namespace Selector'}
                    {from.podSelector && 'Pod Selector'}
                  </div>
                ))}
                {rule.ports?.map((port, portIndex) => (
                  <div key={portIndex}>Port: {port.port} ({port.protocol})</div>
                ))}
              </div>
            ))}
          </DetailsItem>
        )}
        {egress && (
          <DetailsItem label="Egress Rules">
            {egress.map((rule, index) => (
              <div key={index} className="mb-2">
                <h4 className="font-bold">Rule {index + 1}</h4>
                {rule.to?.map((to, toIndex) => (
                  <div key={toIndex}>
                    {to.ipBlock && `IP Block: ${to.ipBlock.cidr}`}
                    {to.namespaceSelector && 'Namespace Selector'}
                    {to.podSelector && 'Pod Selector'}
                  </div>
                ))}
                {rule.ports?.map((port, portIndex) => (
                  <div key={portIndex}>Port: {port.port} ({port.protocol})</div>
                ))}
              </div>
            ))}
          </DetailsItem>
        )}
      </>
    );
  };
  