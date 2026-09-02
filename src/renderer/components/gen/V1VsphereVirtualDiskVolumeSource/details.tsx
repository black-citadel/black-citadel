import { PanelGrid } from "@components/layout/panel";
import type { V1VsphereVirtualDiskVolumeSource } from "@kubernetes/client-node";

export const VsphereVirtualDiskVolumeSourceDetails = ({ resourceData }: { resourceData: V1VsphereVirtualDiskVolumeSource }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.fsType, resourceData.storagePolicyID, resourceData.storagePolicyName, resourceData.volumePath].some(v => v !== undefined && v !== null));
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
                    { label: "Storage Policy ID", value: resourceData.storagePolicyID || '-' },
                    { label: "Storage Policy Name", value: resourceData.storagePolicyName || '-' },
                    { label: "Volume Path", value: resourceData.volumePath }
                ]}
                columns={1}
            />

        </>
    )
}