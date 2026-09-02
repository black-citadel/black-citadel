import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1ContainerPort } from "@kubernetes/client-node";

export const ContainerPortDetails = ({ resourceData }: { resourceData: V1ContainerPort }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.name),
        hasValue(resourceData.containerPort),
        hasValue(resourceData.protocol),
        hasValue(resourceData.hostPort),
        hasValue(resourceData.hostIP),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Name", value: resourceData.name, description: "If specified, this must be an IANA_SVC_NAME and unique within the pod." },
                    { label: "Container Port", value: resourceData.containerPort, description: "Number of port to expose on the pod's IP address." },
                    { label: "Protocol", value: resourceData.protocol, description: "Protocol for port." },
                    { label: "Host Port", value: resourceData.hostPort, description: "Number of port to expose on the host." },
                    { label: "Host IP", value: resourceData.hostIP, description: "What host IP to bind the external port to." },
                ]}
            />

        </>
    )
}
