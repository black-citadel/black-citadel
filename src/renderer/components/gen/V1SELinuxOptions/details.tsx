import { PanelGrid } from "@components/layout/panel";
import type { V1SELinuxOptions } from "@kubernetes/client-node";

export const SELinuxOptionsDetails = ({ resourceData }: { resourceData: V1SELinuxOptions }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.level, resourceData.role, resourceData.type, resourceData.user].some(v => v !== undefined && v !== null));
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
                    { label: "Level", value: resourceData.level || '-' },
                    { label: "Role", value: resourceData.role || '-' },
                    { label: "Type", value: resourceData.type || '-' },
                    { label: "User", value: resourceData.user || '-' }
                ]}
                columns={1}
            />

        </>
    )
}