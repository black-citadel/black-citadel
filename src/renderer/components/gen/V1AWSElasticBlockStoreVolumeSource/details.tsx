import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1AWSElasticBlockStoreVolumeSource } from "@kubernetes/client-node";

export const AWSElasticBlockStoreVolumeSourceDetails = ({ resourceData }: { resourceData: V1AWSElasticBlockStoreVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.fsType),
        hasValue(resourceData.partition),
        hasValue(resourceData.volumeID),
        resourceData.readOnly === true,
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Fs Type", value: resourceData.fsType, description: "fsType is the filesystem type of the volume that you want to mount." },
                    { label: "Partition", value: resourceData.partition, description: "partition is the partition in the volume that you want to mount." },
                    { label: "Volume ID", value: resourceData.volumeID, description: "volumeID is unique ID of the persistent disk resource in AWS (Amazon EBS volume)." },
                ]}
                flags={[
                    { label: "Read Only", value: resourceData.readOnly, description: "readOnly value true will force the readOnly setting in VolumeMounts." },
                ]}
            />

        </>
    )
}
