import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1ServiceStatus } from "@kubernetes/client-node";
import { ConditionsTable } from "@components/base/conditions-table";
import { LoadBalancerStatusDetails } from "../V1LoadBalancerStatus/details";

export const ServiceStatusDetails = ({ resourceData }: { resourceData: V1ServiceStatus }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.conditions),
        hasValue(resourceData.loadBalancer),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.conditions) && <ConditionsTable conditions={resourceData.conditions } />}

            {hasValue(resourceData.loadBalancer) && (
                <Container title="Load Balancer" collapsible defaultOpen={ true }>
                    <LoadBalancerStatusDetails resourceData={resourceData.loadBalancer } />
                </Container>
            )}

        </>
    )
}
