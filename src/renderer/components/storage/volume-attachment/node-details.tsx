import { DetailsItem } from "@components/details-item";

interface NodeDetailsProps {
    nodeName: string;
  }
  
  export const NodeDetails = ({ nodeName }: NodeDetailsProps): JSX.Element => {
    return (
      <DetailsItem label="Node">
        {nodeName}
      </DetailsItem>
    );
  };