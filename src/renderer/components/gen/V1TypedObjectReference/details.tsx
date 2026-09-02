import { PanelGrid } from "@components/layout/panel";
import type { V1TypedObjectReference } from "@kubernetes/client-node";

export const TypedObjectReferenceDetails = ({ resourceData }: { resourceData: V1TypedObjectReference }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.apiGroup, resourceData.kind, resourceData.name, resourceData.namespace].some(v => v !== undefined && v !== null));
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
                    { label: "Api Group", value: resourceData.apiGroup || '-' },
                    { label: "Kind", value: resourceData.kind },
                    { label: "Name", value: resourceData.name },
                    { label: "Namespace", value: resourceData.namespace || '-' }
                ]}
                columns={1}
            />

        </>
    )
}