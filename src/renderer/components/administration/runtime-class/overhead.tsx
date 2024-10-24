import k8s = require('@kubernetes/client-node');
import { DetailsItem } from "@components/details-item";

interface OverheadProps {
    overhead?: k8s.V1Overhead;
  }
  
  export const Overhead = ({ overhead }: OverheadProps): JSX.Element => {
    if (!overhead) {
      return <DetailsItem label="Overhead">Not specified</DetailsItem>;
    }
  
    return (
      <DetailsItem label="Overhead">
        <div>Pod Fixed: {overhead.podFixed ? JSON.stringify(overhead.podFixed) : 'Not specified'}</div>
      </DetailsItem>
    );
  };