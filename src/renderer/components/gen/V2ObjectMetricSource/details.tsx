import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V2ObjectMetricSource } from "@kubernetes/client-node";
import { CrossVersionObjectReferenceDetails } from "../V2CrossVersionObjectReference/details";
import { MetricIdentifierDetails } from "../V2MetricIdentifier/details";
import { MetricTargetDetails } from "../V2MetricTarget/details";

export const ObjectMetricSourceDetails = ({ resourceData }: { resourceData: V2ObjectMetricSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.describedObject),
        hasValue(resourceData.metric),
        hasValue(resourceData.target),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.describedObject) && (
                <Container title="Described Object" collapsible defaultOpen={ true }>
                    <CrossVersionObjectReferenceDetails resourceData={resourceData.describedObject } />
                </Container>
            )}

            {hasValue(resourceData.metric) && (
                <Container title="Metric" collapsible defaultOpen={ true }>
                    <MetricIdentifierDetails resourceData={resourceData.metric } />
                </Container>
            )}

            {hasValue(resourceData.target) && (
                <Container title="Target" collapsible defaultOpen={ true }>
                    <MetricTargetDetails resourceData={resourceData.target } />
                </Container>
            )}

        </>
    )
}
