import { PanelGrid } from "@components/layout/panel";
import { MetadataDetails } from "@components/metadata";
import type { V1Secret } from "@kubernetes/client-node";
import { SecretData } from "@components/configuration/secret/secret-data";

export const SecretDetails = ({ resourceData }: { resourceData: V1Secret }): JSX.Element => {
    // Transform the String Data object into an array of PanelGridItem objects
    const stringDataItems = resourceData.stringData
        ? Object.entries(resourceData.stringData).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check object properties
        checks.push(stringDataItems.length > 0);
        // Check simple properties
        checks.push([resourceData.type].some(v => v !== undefined && v !== null));
        // Boolean properties always have content
        checks.push(true);
        // Check k8s type properties
        checks.push([resourceData.data].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="String Data"
                items={ stringDataItems }
                columns={1}
            />

            <PanelGrid
                title="Properties"
                items={[
                    { label: "Type", value: resourceData.type || '-' }
                ]}
                columns={1}
            />

            <PanelGrid
                title="Configuration"
                items={[
                    { label: "Immutable", value: resourceData.immutable ? "Yes" : "No" }
                ]}
                columns={1}
            />

            {resourceData.data && <SecretData data={ resourceData.data } />}

            <MetadataDetails metadata={resourceData.metadata} />
        </>
    )
}