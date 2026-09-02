import { PanelGrid, PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1LoadBalancerIngress } from "@kubernetes/client-node";
import { PortStatusDetails } from "../V1PortStatus/details";

export const LoadBalancerIngressDetails = ({ resourceData }: { resourceData: V1LoadBalancerIngress }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.hostname),
        hasValue(resourceData.ip),
        hasValue(resourceData.ipMode),
        hasValue(resourceData.ports),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Hostname", value: resourceData.hostname, description: "Hostname is set for load-balancer ingress points that are DNS based (typically AWS load-balancers)" },
                    { label: "Ip", value: resourceData.ip, description: "IP is set for load-balancer ingress points that are IP based (typically GCE or OpenStack load-balancers)" },
                    { label: "Ip Mode", value: resourceData.ipMode, description: "IPMode specifies how the load-balancer IP behaves, and may only be specified when the ip field is specified." },
                ]}
            />

            {hasValue(resourceData.ports) && (
                <Container title="Ports" count={resourceData.ports.length} collapsible defaultOpen={ true }>
                    {resourceData.ports.map((item, index) => (
                        <PanelListItem key={index}>
                            <PortStatusDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
