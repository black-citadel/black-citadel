import { PanelGrid, hasValue } from "@components/layout/panel";
import { MetadataDetails } from "@components/metadata";
import type { V1Secret } from "@kubernetes/client-node";
import { SecretData } from "@components/configuration/secret/secret-data";

export const SecretDetails = ({ resourceData }: { resourceData: V1Secret }): JSX.Element => {
    const stringDataItems = Object.entries(resourceData.stringData ?? {}).map(([key, value]) => ({ label: key, value }));

    const hasContent = [
        stringDataItems.length > 0,
        hasValue(resourceData.type),
        resourceData.immutable === true,
        hasValue(resourceData.data),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <MetadataDetails metadata={resourceData.metadata} />

            <PanelGrid
                items={[
                    { label: "Type", value: resourceData.type, description: "Used to facilitate programmatic handling of secret data." },
                ]}
                flags={[
                    { label: "Immutable", value: resourceData.immutable, description: "Immutable, if set to true, ensures that data stored in the Secret cannot be updated (only object metadata can be modified)." },
                ]}
            />

            <PanelGrid title="String Data" items={ stringDataItems } />

            {hasValue(resourceData.data) && <SecretData data={resourceData.data } />}

        </>
    )
}
