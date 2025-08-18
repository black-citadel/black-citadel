import { PanelGrid } from "@components/layout/panel";
import { V1OwnerReference } from "@utils/k8s-types";

export const OwnerReferenceDetails = ({ resourceData }: { resourceData: V1OwnerReference }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.name, resourceData.uid, resourceData.apiVersion, resourceData.kind].some(v => v !== undefined && v !== null));
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
                    { label: "Name", value: resourceData.name },
                    { label: "Uid", value: resourceData.uid },
                    { label: "Api Version", value: resourceData.apiVersion },
                    { label: "Kind", value: resourceData.kind }
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