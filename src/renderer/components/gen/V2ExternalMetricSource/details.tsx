import { Container } from "@components/base/container";
import { V2ExternalMetricSource } from "@utils/k8s-types";
import { MetricIdentifierDetails } from "../V2MetricIdentifier/details";
import { MetricTargetDetails } from "../V2MetricTarget/details";

export const ExternalMetricSourceDetails = ({ resourceData }: { resourceData: V2ExternalMetricSource }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check k8s type properties
        checks.push([resourceData.metric, resourceData.target].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <Container title="Metric">
                <MetricIdentifierDetails resourceData={ resourceData.metric } />
            </Container>

            <Container title="Target">
                <MetricTargetDetails resourceData={ resourceData.target } />
            </Container>

        </>
    )
}