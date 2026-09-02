import { PanelGrid } from "@components/layout/panel";
import type { V1OwnerReference } from "@kubernetes/client-node";

export const OwnerReferenceDetails = ({ resourceData }: { resourceData: V1OwnerReference }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.apiVersion, resourceData.kind, resourceData.name, resourceData.uid].some(v => v !== undefined && v !== null));
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
                    { label: "Api Version", value: resourceData.apiVersion },
                    { label: "Kind", value: resourceData.kind },
                    { label: "Name", value: resourceData.name },
                    { label: "Uid", value: resourceData.uid }
                ]}
                columns={1}
            />

            <PanelGrid
                title="Configuration"
                items={[
                    { label: "Block Owner Deletion", value: resourceData.blockOwnerDeletion ? "Yes" : "No" },
                    { label: "Controller", value: resourceData.controller ? "Yes" : "No" }
                ]}
                columns={1}
            />

        </>
    )
}