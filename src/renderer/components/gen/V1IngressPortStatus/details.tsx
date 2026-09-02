import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1IngressPortStatus } from "@kubernetes/client-node";

export const IngressPortStatusDetails = ({ resourceData }: { resourceData: V1IngressPortStatus }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.error),
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
                    { label: "Error", value: resourceData.error, description: "error is to record the problem with the service port The format of the error shall comply with the following rules: - built-in error values shall be specified…" },
                    { label: "Port", value: resourceData.port, description: "port is the port number of the ingress port." },
                    { label: "Protocol", value: resourceData.protocol, description: "protocol is the protocol of the ingress port." },
                ]}
            />

        </>
    )
}
