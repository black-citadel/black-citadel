import { PanelGrid } from "@components/layout/panel";
import { MetadataDetails } from "@components/metadata";
import type { V1ConfigMap } from "@kubernetes/client-node";

export const ConfigMapDetails = ({ resourceData }: { resourceData: V1ConfigMap }): JSX.Element => {
    const dataItems = Object.entries(resourceData.data ?? {}).map(([key, value]) => ({ label: key, value }));
    const binaryDataItems = Object.entries(resourceData.binaryData ?? {}).map(([key, value]) => ({ label: key, value }));

    const hasContent = [
        dataItems.length > 0,
        binaryDataItems.length > 0,
        resourceData.immutable === true,
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <MetadataDetails metadata={resourceData.metadata} />

            <PanelGrid
                items={[
                ]}
                flags={[
                    { label: "Immutable", value: resourceData.immutable, description: "Immutable, if set to true, ensures that data stored in the ConfigMap cannot be updated (only object metadata can be modified)." },
                ]}
            />

            <PanelGrid title="Data" items={ dataItems } />

            <PanelGrid title="Binary Data" items={ binaryDataItems } />

        </>
    )
}
