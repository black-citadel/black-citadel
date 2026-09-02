import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1IngressStatus } from "@kubernetes/client-node";
import { IngressLoadBalancerStatusDetails } from "../V1IngressLoadBalancerStatus/details";

export const IngressStatusDetails = ({ resourceData }: { resourceData: V1IngressStatus }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.loadBalancer),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.loadBalancer) && (
                <Container title="Load Balancer" collapsible defaultOpen={ true }>
                    <IngressLoadBalancerStatusDetails resourceData={resourceData.loadBalancer } />
                </Container>
            )}

        </>
    )
}
