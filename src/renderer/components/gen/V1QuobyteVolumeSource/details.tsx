import { PanelGrid } from "@components/layout/panel";
import type { V1QuobyteVolumeSource } from "@kubernetes/client-node";

export const QuobyteVolumeSourceDetails = ({ resourceData }: { resourceData: V1QuobyteVolumeSource }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.group, resourceData.registry, resourceData.tenant, resourceData.user, resourceData.volume].some(v => v !== undefined && v !== null));
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
                    { label: "Group", value: resourceData.group || '-' },
                    { label: "Registry", value: resourceData.registry },
                    { label: "Tenant", value: resourceData.tenant || '-' },
                    { label: "User", value: resourceData.user || '-' },
                    { label: "Volume", value: resourceData.volume }
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