import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1PortStatus } from "@kubernetes/client-node";

export const PortStatusDetails = ({ resourceData }: { resourceData: V1PortStatus }): JSX.Element => {

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
                    { label: "Error", value: resourceData.error, description: "Error is to record the problem with the service port The format of the error shall comply with the following rules: - built-in error values shall be specified…" },
                    { label: "Port", value: resourceData.port, description: "Port is the port number of the service port of which status is recorded here" },
                    { label: "Protocol", value: resourceData.protocol, description: "Protocol is the protocol of the service port of which status is recorded here The supported values are: \"TCP\", \"UDP\", \"SCTP\"" },
                ]}
            />

        </>
    )
}
