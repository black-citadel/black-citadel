import k8s = require('@kubernetes/client-node');
import { DetailsItem } from "@components/details-item";

interface ContainerListProps {
    containers: k8s.V1Container[];
  }
  
  export const ContainerList = ({ containers }: ContainerListProps): JSX.Element => {
    return (
      <DetailsItem label="Containers">
        {containers.map((container, index) => (
          <div key={index} className="mb-2">
            <div>Name: {container.name}</div>
            <div>Image: {container.image}</div>
            <div>Ports: {container.ports?.map(port => `${port.containerPort}/${port.protocol}`).join(', ')}</div>
          </div>
        ))}
      </DetailsItem>
    );
  };