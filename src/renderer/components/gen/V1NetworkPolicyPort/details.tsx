import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1NetworkPolicyPort } from "@kubernetes/client-node";

export const NetworkPolicyPortDetails = ({ resourceData }: { resourceData: V1NetworkPolicyPort }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.endPort),
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
                    { label: "End Port", value: resourceData.endPort, description: "endPort indicates that the range of ports from port to endPort if set, inclusive, should be allowed by the policy." },
                    { label: "Port", value: resourceData.port, description: "IntOrString is a type that can hold an int32 or a string." },
                    { label: "Protocol", value: resourceData.protocol, description: "protocol represents the protocol (TCP, UDP, or SCTP) which traffic must match." },
                ]}
            />

        </>
    )
}
