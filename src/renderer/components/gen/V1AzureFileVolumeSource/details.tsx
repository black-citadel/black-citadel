import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1AzureFileVolumeSource } from "@kubernetes/client-node";

export const AzureFileVolumeSourceDetails = ({ resourceData }: { resourceData: V1AzureFileVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.secretName),
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
                    { label: "Share Name", value: resourceData.shareName, description: "shareName is the azure share Name" },
                ]}
                flags={[
                    { label: "Read Only", value: resourceData.readOnly, description: "readOnly defaults to false (read/write)." },
                ]}
            />

        </>
    )
}
