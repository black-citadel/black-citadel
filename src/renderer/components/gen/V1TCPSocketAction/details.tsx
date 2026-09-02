import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1TCPSocketAction } from "@kubernetes/client-node";

export const TCPSocketActionDetails = ({ resourceData }: { resourceData: V1TCPSocketAction }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.host),
        hasValue(resourceData.port),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Host", value: resourceData.host, description: "Optional: Host name to connect to, defaults to the pod IP." },
                    { label: "Port", value: resourceData.port, description: "IntOrString is a type that can hold an int32 or a string." },
                ]}
            />

        </>
    )
}
