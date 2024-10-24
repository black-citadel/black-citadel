import { DetailsItem } from "@components/details-item";

interface PolicyTypesProps {
  policyTypes: string[];
}

export const PolicyTypes = ({ policyTypes }: PolicyTypesProps): JSX.Element => {
  return (
    <DetailsItem label="Policy Types">
      {policyTypes.map((type, index) => (
        <div key={index}>{type}</div>
      ))}
    </DetailsItem>
  );
};