import { DetailsItem } from "@components/details-item";

interface VolumeModeProps {
    volumeMode?: string;
  }
  
  export const VolumeMode = ({ volumeMode }: VolumeModeProps): JSX.Element => {
    return (
      <DetailsItem label="Volume Mode">
        {volumeMode || 'Filesystem'}
      </DetailsItem>
    );
  };