import { DetailsItem } from "@components/details-item";

interface StorageDetailsProps {
    requests?: { [key: string]: string };
    limits?: { [key: string]: string };
  }
  
  export const StorageDetails = ({ requests, limits }: StorageDetailsProps): JSX.Element => {
    return (
      <DetailsItem label="Storage">
        <div>Requests: {requests?.storage || 'Not specified'}</div>
        <div>Limits: {limits?.storage || 'Not specified'}</div>
      </DetailsItem>
    );
  };