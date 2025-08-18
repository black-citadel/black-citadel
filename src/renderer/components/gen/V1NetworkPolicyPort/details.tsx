import { PanelGrid } from "@components/layout/panel";
import { V1NetworkPolicyPort } from "@utils/k8s-types";

export const NetworkPolicyPortDetails = ({ resourceData }: { resourceData: V1NetworkPolicyPort }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.endPort, resourceData.port, resourceData.protocol].some(v => v !== undefined && v !== null));
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
                    { label: "End Port", value: resourceData.endPort || '-' },
                    { label: "Port", value: resourceData.port || '-' },
                    { label: "Protocol", value: resourceData.protocol || '-' }
                ]}
                columns={1}
            />

        </>
    )
}