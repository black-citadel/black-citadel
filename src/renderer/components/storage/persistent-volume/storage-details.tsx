import { DetailsItem } from "@components/details-item";

interface StorageDetailsProps {
    capacity?: { [key: string]: string };
  }
  
  export const StorageDetails = ({ capacity }: StorageDetailsProps): JSX.Element => {
    return (
      <DetailsItem label="Capacity">
        {capacity?.storage || 'Not specified'}
      </DetailsItem>
    );
  };