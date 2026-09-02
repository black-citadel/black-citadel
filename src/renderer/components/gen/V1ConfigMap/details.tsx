import { PanelGrid } from "@components/layout/panel";
import { MetadataDetails } from "@components/metadata";
import type { V1ConfigMap } from "@kubernetes/client-node";

export const ConfigMapDetails = ({ resourceData }: { resourceData: V1ConfigMap }): JSX.Element => {
    // Transform the Binary Data object into an array of PanelGridItem objects
    const binaryDataItems = resourceData.binaryData
        ? Object.entries(resourceData.binaryData).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];
    // Transform the Data object into an array of PanelGridItem objects
    const dataItems = resourceData.data
        ? Object.entries(resourceData.data).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check object properties
        checks.push(binaryDataItems.length > 0 || dataItems.length > 0);
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
                title="Binary Data"
                items={ binaryDataItems }
                columns={1}
            />

            <PanelGrid
                title="Data"
                items={ dataItems }
                columns={1}
            />

            <PanelGrid
                title="Configuration"
                items={[
                    { label: "Immutable", value: resourceData.immutable ? "Yes" : "No" }
                ]}
                columns={1}
            />

            <MetadataDetails metadata={resourceData.metadata} />
        </>
    )
}