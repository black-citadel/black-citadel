import k8s = require('@kubernetes/client-node');
import { DetailsItem, DetailsLabels } from "@components/details-item";

interface PodTemplateProps {
    template: k8s.V1PodTemplateSpec;
  }
  
  export const PodTemplate = ({ template }: PodTemplateProps): JSX.Element => {
    return (
      <DetailsItem label="Pod Template">
        <DetailsLabels labels={template.metadata?.labels} />
        <DetailsItem label="Containers">
          {template.spec?.containers.map((container, index) => (
            <div key={index}>
              <div>Name: {container.name}</div>
              <div>Image: {container.image}</div>
              {/* Add more container details as needed */}
            </div>
          ))}
        </DetailsItem>
        {/* Add more pod template details as needed */}
      </DetailsItem>
    );
  };