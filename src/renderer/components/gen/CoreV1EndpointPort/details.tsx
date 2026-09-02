import { PanelGrid, hasValue } from "@components/layout/panel";
import type { CoreV1EndpointPort } from "@kubernetes/client-node";

export const CoreV1EndpointPortDetails = ({ resourceData }: { resourceData: CoreV1EndpointPort }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.appProtocol),
        hasValue(resourceData.name),
        hasValue(resourceData.port),
        hasValue(resourceData.protocol),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "App Protocol", value: resourceData.appProtocol, description: "The application protocol for this port." },
                    { label: "Name", value: resourceData.name, description: "The name of this port." },
                    { label: "Port", value: resourceData.port, description: "The port number of the endpoint." },
                    { label: "Protocol", value: resourceData.protocol, description: "The IP protocol for this port." },
                ]}
            />

        </>
    )
}
