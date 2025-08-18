import { Container } from "@components/base/container";
import { V1ServiceStatus } from "@utils/k8s-types";
import { ConditionsTable } from "@components/base/conditions-table";
import { LoadBalancerStatusDetails } from "../V1LoadBalancerStatus/details";

export const ServiceStatusDetails = ({ resourceData }: { resourceData: V1ServiceStatus }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check k8s type properties
        checks.push([resourceData.conditions, resourceData.loadBalancer].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.conditions && (
                <ConditionsTable conditions={ resourceData.conditions } />
            )}

            {resourceData.loadBalancer && (
                <Container title="Load Balancer">
                    <LoadBalancerStatusDetails resourceData={ resourceData.loadBalancer } />
                </Container>
            )}

        </>
    )
}