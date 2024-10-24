import { DetailsItem } from "@components/details-item";

interface ParametersProps {
    parameters?: { [key: string]: string };
  }
  
  export const Parameters = ({ parameters }: ParametersProps): JSX.Element => {
    if (!parameters || Object.keys(parameters).length === 0) {
      return <DetailsItem label="Parameters">None</DetailsItem>;
    }
  
    return (
      <DetailsItem label="Parameters">
        {Object.entries(parameters).map(([key, value]) => (
          <div key={key} className="mb-1">
            <span className="font-semibold">{key}:</span> {value}
          </div>
        ))}
      </DetailsItem>
    );
  };