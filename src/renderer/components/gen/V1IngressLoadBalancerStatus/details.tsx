import { PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1IngressLoadBalancerStatus } from "@kubernetes/client-node";
import { IngressLoadBalancerIngressDetails } from "../V1IngressLoadBalancerIngress/details";

export const IngressLoadBalancerStatusDetails = ({ resourceData }: { resourceData: V1IngressLoadBalancerStatus }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.ingress),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.ingress) && (
                <Container title="Ingress" count={resourceData.ingress.length} collapsible defaultOpen={ true }>
                    {resourceData.ingress.map((item, index) => (
                        <PanelListItem key={index}>
                            <IngressLoadBalancerIngressDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
