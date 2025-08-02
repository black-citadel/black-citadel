import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1ServicePort } from "@utils/k8s-types";

export const ServicePortDetails = ({ resourceData }: { resourceData: V1ServicePort }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.appProtocol, resourceData.name, resourceData.nodePort, resourceData.port, resourceData.protocol, resourceData.targetPort].some(v => v !== undefined && v !== null));
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
                    { label: "App Protocol", value: resourceData.appProtocol || '-' },
                    { label: "Name", value: resourceData.name || '-' },
                    { label: "Node Port", value: resourceData.nodePort || '-' },
                    { label: "Port", value: resourceData.port },
                    { label: "Protocol", value: resourceData.protocol || '-' },
                    { label: "Target Port", value: resourceData.targetPort || '-' }
                ]}
                columns={1}
            />

        </>
    )
}