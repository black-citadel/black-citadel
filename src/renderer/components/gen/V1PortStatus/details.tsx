import { PanelGrid } from "@components/layout/panel";
import { V1PortStatus } from "@utils/k8s-types";

export const PortStatusDetails = ({ resourceData }: { resourceData: V1PortStatus }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.error, resourceData.port, resourceData.protocol].some(v => v !== undefined && v !== null));
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
                    { label: "Error", value: resourceData.error || '-' },
                    { label: "Port", value: resourceData.port },
                    { label: "Protocol", value: resourceData.protocol }
                ]}
                columns={1}
            />

        </>
    )
}