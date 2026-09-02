import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1IngressTLS } from "@kubernetes/client-node";

export const IngressTLSDetails = ({ resourceData }: { resourceData: V1IngressTLS }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.hosts),
        hasValue(resourceData.secretName),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Hosts", value: resourceData.hosts, description: "hosts is a list of hosts included in the TLS certificate." },
                    { label: "Secret Name", value: resourceData.secretName, description: "secretName is the name of the secret used to terminate TLS traffic on port 443." },
                ]}
            />

        </>
    )
}
