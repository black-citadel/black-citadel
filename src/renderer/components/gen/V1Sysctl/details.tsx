import { PanelGrid } from "@components/layout/panel";
import type { V1Sysctl } from "@kubernetes/client-node";

export const SysctlDetails = ({ resourceData }: { resourceData: V1Sysctl }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.name, resourceData.value].some(v => v !== undefined && v !== null));
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
                    { label: "Name", value: resourceData.name },
                    { label: "Value", value: resourceData.value }
                ]}
                columns={1}
            />

        </>
    )
}