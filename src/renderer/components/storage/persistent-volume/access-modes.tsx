import { DetailsItem } from "@components/details-item";

interface AccessModesProps {
    accessModes?: string[];
  }
  
  export const AccessModes = ({ accessModes }: AccessModesProps): JSX.Element => {
    if (!accessModes || accessModes.length === 0) {
      return <DetailsItem label="Access Modes">None specified</DetailsItem>;
    }
  
    return (
      <DetailsItem label="Access Modes">
        {accessModes.join(', ')}
      </DetailsItem>
    );
  };