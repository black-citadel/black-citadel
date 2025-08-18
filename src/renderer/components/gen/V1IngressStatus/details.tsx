import { Container } from "@components/base/container";
import { V1IngressStatus } from "@utils/k8s-types";
import { IngressLoadBalancerStatusDetails } from "../V1IngressLoadBalancerStatus/details";

export const IngressStatusDetails = ({ resourceData }: { resourceData: V1IngressStatus }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check k8s type properties
        checks.push([resourceData.loadBalancer].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.loadBalancer && (
                <Container title="Load Balancer">
                    <IngressLoadBalancerStatusDetails resourceData={ resourceData.loadBalancer } />
                </Container>
            )}

        </>
    )
}