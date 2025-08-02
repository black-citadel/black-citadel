import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1GlusterfsVolumeSource } from "@utils/k8s-types";

export const GlusterfsVolumeSourceDetails = ({ resourceData }: { resourceData: V1GlusterfsVolumeSource }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.endpoints, resourceData.path].some(v => v !== undefined && v !== null));
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
                    { label: "Endpoints", value: resourceData.endpoints },
                    { label: "Path", value: resourceData.path }
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