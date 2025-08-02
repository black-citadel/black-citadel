import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1ImageVolumeSource } from "@utils/k8s-types";

export const ImageVolumeSourceDetails = ({ resourceData }: { resourceData: V1ImageVolumeSource }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.pullPolicy, resourceData.reference].some(v => v !== undefined && v !== null));
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
                    { label: "Pull Policy", value: resourceData.pullPolicy || '-' },
                    { label: "Reference", value: resourceData.reference || '-' }
                ]}
                columns={1}
            />

        </>
    )
}