import { Container } from "@components/base/container";
import { V2ObjectMetricStatus } from "@utils/k8s-types";
import { MetricValueStatusDetails } from "../V2MetricValueStatus/details";
import { CrossVersionObjectReferenceDetails } from "../V2CrossVersionObjectReference/details";
import { MetricIdentifierDetails } from "../V2MetricIdentifier/details";

export const ObjectMetricStatusDetails = ({ resourceData }: { resourceData: V2ObjectMetricStatus }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check k8s type properties
        checks.push([resourceData.current, resourceData.describedObject, resourceData.metric].some(v => v !== undefined && v !== null));
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

            <Container title="Described Object">
                <CrossVersionObjectReferenceDetails resourceData={ resourceData.describedObject } />
            </Container>

            <Container title="Metric">
                <MetricIdentifierDetails resourceData={ resourceData.metric } />
            </Container>

        </>
    )
}