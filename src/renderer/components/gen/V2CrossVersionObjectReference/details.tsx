import { PanelGrid } from "@components/layout/panel";
import type { V2CrossVersionObjectReference } from "@kubernetes/client-node";

export const CrossVersionObjectReferenceDetails = ({ resourceData }: { resourceData: V2CrossVersionObjectReference }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.apiVersion, resourceData.kind, resourceData.name].some(v => v !== undefined && v !== null));
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
                    { label: "Api Version", value: resourceData.apiVersion || '-' },
                    { label: "Kind", value: resourceData.kind },
                    { label: "Name", value: resourceData.name }
                ]}
                columns={1}
            />

        </>
    )
}