import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1AzureFilePersistentVolumeSource } from "@kubernetes/client-node";

export const AzureFilePersistentVolumeSourceDetails = ({ resourceData }: { resourceData: V1AzureFilePersistentVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.secretName),
        hasValue(resourceData.secretNamespace),
        hasValue(resourceData.shareName),
        resourceData.readOnly === true,
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Secret Name", value: resourceData.secretName, description: "secretName is the name of secret that contains Azure Storage Account Name and Key" },
                    { label: "Secret Namespace", value: resourceData.secretNamespace, description: "secretNamespace is the namespace of the secret that contains Azure Storage Account Name and Key default is the same as the Pod" },
                    { label: "Share Name", value: resourceData.shareName, description: "shareName is the azure Share Name" },
                ]}
                flags={[
                    { label: "Read Only", value: resourceData.readOnly, description: "readOnly defaults to false (read/write)." },
                ]}
            />

        </>
    )
}
