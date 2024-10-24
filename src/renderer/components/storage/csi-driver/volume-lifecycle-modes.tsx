import { DetailsItem } from "@components/details-item";

interface VolumeLifecycleModesProps {
    modes?: string[];
  }
  
  export const VolumeLifecycleModes = ({ modes }: VolumeLifecycleModesProps): JSX.Element => {
    if (!modes || modes.length === 0) {
      return <DetailsItem label="Volume Lifecycle Modes">None specified</DetailsItem>;
    }
  
    return (
      <DetailsItem label="Volume Lifecycle Modes">
        {modes.map((mode, index) => (
          <div key={index} className="mb-1">
            {mode}
          </div>
        ))}
      </DetailsItem>
    );
  };