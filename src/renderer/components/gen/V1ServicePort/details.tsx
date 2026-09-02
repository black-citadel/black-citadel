import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1ServicePort } from "@kubernetes/client-node";

export const ServicePortDetails = ({ resourceData }: { resourceData: V1ServicePort }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.appProtocol),
        hasValue(resourceData.name),
        hasValue(resourceData.nodePort),
        hasValue(resourceData.port),
        hasValue(resourceData.protocol),
        hasValue(resourceData.targetPort),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "App Protocol", value: resourceData.appProtocol, description: "The application protocol for this port." },
                    { label: "Name", value: resourceData.name, description: "The name of this port within the service." },
                    { label: "Node Port", value: resourceData.nodePort, description: "The port on each node on which this service is exposed when type is NodePort or LoadBalancer." },
                    { label: "Port", value: resourceData.port, description: "The port that will be exposed by this service." },
                    { label: "Protocol", value: resourceData.protocol, description: "The IP protocol for this port." },
                    { label: "Target Port", value: resourceData.targetPort, description: "IntOrString is a type that can hold an int32 or a string." },
                ]}
            />

        </>
    )
}
