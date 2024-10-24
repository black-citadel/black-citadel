import k8s = require('@kubernetes/client-node');
import { DetailsItem } from "@components/details-item";

interface SourceDetailsProps {
    source: k8s.V1VolumeAttachmentSource;
  }
  
  export const SourceDetails = ({ source }: SourceDetailsProps): JSX.Element => {
    return (
      <DetailsItem label="Source">
        {source.persistentVolumeName && (
          <div>Persistent Volume: {source.persistentVolumeName}</div>
        )}
        {source.inlineVolumeSpec && (
          <div>
            <div>Inline Volume Spec:</div>
            <pre className="text-sm overflow-auto">{JSON.stringify(source.inlineVolumeSpec, null, 2)}</pre>
          </div>
        )}
      </DetailsItem>
    );
  };