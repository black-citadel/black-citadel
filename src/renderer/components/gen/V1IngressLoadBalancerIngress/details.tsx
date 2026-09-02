import { PanelGrid, PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1IngressLoadBalancerIngress } from "@kubernetes/client-node";
import { IngressPortStatusDetails } from "../V1IngressPortStatus/details";

export const IngressLoadBalancerIngressDetails = ({ resourceData }: { resourceData: V1IngressLoadBalancerIngress }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.hostname),
        hasValue(resourceData.ip),
        hasValue(resourceData.ports),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Hostname", value: resourceData.hostname, description: "hostname is set for load-balancer ingress points that are DNS based." },
                    { label: "Ip", value: resourceData.ip, description: "ip is set for load-balancer ingress points that are IP based." },
                ]}
            />

            {hasValue(resourceData.ports) && (
                <Container title="Ports" count={resourceData.ports.length} collapsible defaultOpen={ true }>
                    {resourceData.ports.map((item, index) => (
                        <PanelListItem key={index}>
                            <IngressPortStatusDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
