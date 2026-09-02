import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1HostAlias } from "@kubernetes/client-node";

export const HostAliasDetails = ({ resourceData }: { resourceData: V1HostAlias }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.hostnames),
        hasValue(resourceData.ip),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Hostnames", value: resourceData.hostnames, description: "Hostnames for the above IP address." },
                    { label: "Ip", value: resourceData.ip, description: "IP address of the host file entry." },
                ]}
            />

        </>
    )
}
