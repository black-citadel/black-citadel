import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1FlockerVolumeSource } from "@kubernetes/client-node";

export const FlockerVolumeSourceDetails = ({ resourceData }: { resourceData: V1FlockerVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.datasetName),
        hasValue(resourceData.datasetUUID),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Dataset Name", value: resourceData.datasetName, description: "datasetName is Name of the dataset stored as metadata -> name on the dataset for Flocker should be considered as deprecated" },
                    { label: "Dataset UUID", value: resourceData.datasetUUID, description: "datasetUUID is the UUID of the dataset." },
                ]}
            />

        </>
    )
}
