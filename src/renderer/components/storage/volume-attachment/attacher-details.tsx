import { DetailsItem } from "@components/details-item";

interface AttacherDetailsProps {
    attacher: string;
  }
  
  export const AttacherDetails = ({ attacher }: AttacherDetailsProps): JSX.Element => {
    return (
      <DetailsItem label="Attacher">
        {attacher}
      </DetailsItem>
    );
  };