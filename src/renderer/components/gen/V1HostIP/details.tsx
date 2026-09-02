import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1HostIP } from "@kubernetes/client-node";

export const HostIPDetails = ({ resourceData }: { resourceData: V1HostIP }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.ip),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Ip", value: resourceData.ip, description: "IP is the IP address assigned to the host" },
                ]}
            />

        </>
    )
}
