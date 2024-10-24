import k8s = require('@kubernetes/client-node');
import { DetailsItem } from "@components/details-item";

interface CSIDriversListProps {
    drivers?: k8s.V1CSINodeDriver[];
  }
  
  export const CSIDriversList = ({ drivers }: CSIDriversListProps): JSX.Element => {
    if (!drivers || drivers.length === 0) {
      return <DetailsItem label="CSI Drivers">None</DetailsItem>;
    }
  
    return (
      <DetailsItem label="CSI Drivers">
        {drivers.map((driver, index) => (
          <div key={index} className="mb-2 p-2 border border-gray-200 rounded">
            <div className="font-bold">Name: {driver.name}</div>
            <div>Node ID: {driver.nodeID}</div>
            <div>Topology Keys: {driver.topologyKeys?.join(', ') || 'None'}</div>
            {driver.allocatable && (
              <div>
                Allocatable:
                <div className="ml-4">
                  Count: {driver.allocatable.count}
                </div>
              </div>
            )}
          </div>
        ))}
      </DetailsItem>
    );
  };
  