import k8s = require('@kubernetes/client-node');
import { DetailsItem } from '@components/details-item';

interface IngressRulesProps {
  rules: k8s.V1IngressRule[];
}

export const IngressRules = ({ rules }: IngressRulesProps): JSX.Element => {
  return (
    <div>
      {rules.map((rule, index) => (
        <div key={index} className="mb-4">
          <DetailsItem label="Host">
            {rule.host || '<none>'}
          </DetailsItem>
          {rule.http && (
            <DetailsItem label="HTTP">
              {rule.http.paths.map((path, pathIndex) => (
                <div key={pathIndex} className="ml-4">
                  <div>Path: {path.path}</div>
                  <div>PathType: {path.pathType}</div>
                  <div>Backend: {path.backend.service.name}:{path.backend.service.port.number}</div>
                </div>
              ))}
            </DetailsItem>
          )}
        </div>
      ))}
    </div>
  );
};