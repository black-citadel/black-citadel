import k8s = require('@kubernetes/client-node');
import { DetailsItem } from "@components/details-item";

interface AllowedTopologiesProps {
    allowedTopologies?: k8s.V1TopologySelectorTerm[];
  }
  
  export const AllowedTopologies = ({ allowedTopologies }: AllowedTopologiesProps): JSX.Element => {
    if (!allowedTopologies || allowedTopologies.length === 0) {
      return <DetailsItem label="Allowed Topologies">None specified</DetailsItem>;
    }
  
    return (
      <DetailsItem label="Allowed Topologies">
        {allowedTopologies.map((term, index) => (
          <div key={index} className="mb-2">
            <div className="font-semibold">Term {index + 1}:</div>
            {term.matchLabelExpressions?.map((expr, exprIndex) => (
              <div key={exprIndex} className="ml-4">
                <span className="font-semibold">{expr.key}:</span> {expr.values?.join(', ')}
              </div>
            ))}
          </div>
        ))}
      </DetailsItem>
    );
  };