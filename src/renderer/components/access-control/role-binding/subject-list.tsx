import { DetailsItem } from '@components/details-item';
import k8s = require('@kubernetes/client-node');

interface SubjectListProps {
    subjects?: k8s.RbacV1Subject[];
  }
  
  export const SubjectList = ({ subjects }: SubjectListProps): JSX.Element => {
    if (!subjects || subjects.length === 0) {
      return <DetailsItem label="Subjects">None</DetailsItem>;
    }
  
    return (
      <DetailsItem label="Subjects">
        {subjects.map((subject, index) => (
          <div key={index} className="mb-2 p-2 border border-gray-200 rounded">
            <div>Kind: {subject.kind}</div>
            <div>Name: {subject.name}</div>
            {subject.namespace && <div>Namespace: {subject.namespace}</div>}
            {subject.apiGroup && <div>API Group: {subject.apiGroup}</div>}
          </div>
        ))}
      </DetailsItem>
    );
  };