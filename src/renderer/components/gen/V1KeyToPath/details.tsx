import { PanelGrid } from "@components/layout/panel";
import type { V1KeyToPath } from "@kubernetes/client-node";

export const KeyToPathDetails = ({ resourceData }: { resourceData: V1KeyToPath }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.key, resourceData.mode, resourceData.path].some(v => v !== undefined && v !== null));
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
                    { label: "Key", value: resourceData.key },
                    { label: "Mode", value: resourceData.mode || '-' },
                    { label: "Path", value: resourceData.path }
                ]}
                columns={1}
            />

        </>
    )
}