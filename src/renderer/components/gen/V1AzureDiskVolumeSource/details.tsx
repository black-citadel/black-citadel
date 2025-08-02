import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1AzureDiskVolumeSource } from "@utils/k8s-types";

export const AzureDiskVolumeSourceDetails = ({ resourceData }: { resourceData: V1AzureDiskVolumeSource }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.cachingMode, resourceData.diskName, resourceData.diskURI, resourceData.fsType].some(v => v !== undefined && v !== null));
        // Boolean properties always have content
        checks.push(true);
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
                    { label: "Caching Mode", value: resourceData.cachingMode || '-' },
                    { label: "Disk Name", value: resourceData.diskName },
                    { label: "Disk URI", value: resourceData.diskURI },
                    { label: "Fs Type", value: resourceData.fsType || '-' }
                ]}
                columns={1}
            />

            <PanelGrid
                title="Configuration"
                items={[
                    { label: "Read Only", value: resourceData.readOnly ? "Yes" : "No" }
                ]}
                columns={1}
            />

        </>
    )
}