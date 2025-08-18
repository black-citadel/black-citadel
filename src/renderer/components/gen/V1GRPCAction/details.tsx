import { PanelGrid } from "@components/layout/panel";
import { V1GRPCAction } from "@utils/k8s-types";

export const GRPCActionDetails = ({ resourceData }: { resourceData: V1GRPCAction }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.port, resourceData.service].some(v => v !== undefined && v !== null));
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
                    { label: "Port", value: resourceData.port },
                    { label: "Service", value: resourceData.service || '-' }
                ]}
                columns={1}
            />

        </>
    )
}