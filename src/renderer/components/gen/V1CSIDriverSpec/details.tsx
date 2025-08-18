import { PanelGrid } from "@components/layout/panel";
import { V1CSIDriverSpec } from "@utils/k8s-types";

export const CSIDriverSpecDetails = ({ resourceData }: { resourceData: V1CSIDriverSpec }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.fsGroupPolicy].some(v => v !== undefined && v !== null));
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
                    { label: "Fs Group Policy", value: resourceData.fsGroupPolicy || '-' }
                ]}
                columns={1}
            />

            <PanelGrid
                title="Configuration"
                items={[
                    { label: "Attach Required", value: resourceData.attachRequired ? "Yes" : "No" },
                    { label: "Pod Info On Mount", value: resourceData.podInfoOnMount ? "Yes" : "No" },
                    { label: "Requires Republish", value: resourceData.requiresRepublish ? "Yes" : "No" },
                    { label: "Se Linux Mount", value: resourceData.seLinuxMount ? "Yes" : "No" },
                    { label: "Storage Capacity", value: resourceData.storageCapacity ? "Yes" : "No" }
                ]}
                columns={1}
            />

        </>
    )
}