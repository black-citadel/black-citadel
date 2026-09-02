import { Container } from "@components/base/container";
import type { V2PodsMetricStatus } from "@kubernetes/client-node";
import { MetricValueStatusDetails } from "../V2MetricValueStatus/details";
import { MetricIdentifierDetails } from "../V2MetricIdentifier/details";

export const PodsMetricStatusDetails = ({ resourceData }: { resourceData: V2PodsMetricStatus }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check k8s type properties
        checks.push([resourceData.current, resourceData.metric].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <Container title="Current">
                <MetricValueStatusDetails resourceData={ resourceData.current } />
            </Container>

            <Container title="Metric">
                <MetricIdentifierDetails resourceData={ resourceData.metric } />
            </Container>

        </>
    )
}