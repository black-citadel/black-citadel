import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1PhotonPersistentDiskVolumeSource } from "@utils/k8s-types";

export const PhotonPersistentDiskVolumeSourceDetails = ({ resourceData }: { resourceData: V1PhotonPersistentDiskVolumeSource }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.fsType, resourceData.pdID].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="Properties"
                items={[
                    { label: "Fs Type", value: resourceData.fsType || '-' },
                    { label: "Pd ID", value: resourceData.pdID }
                ]}
                columns={1}
            />

        </>
    )
}