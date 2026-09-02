import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V2ExternalMetricStatus } from "@kubernetes/client-node";
import { MetricValueStatusDetails } from "../V2MetricValueStatus/details";
import { MetricIdentifierDetails } from "../V2MetricIdentifier/details";

export const ExternalMetricStatusDetails = ({ resourceData }: { resourceData: V2ExternalMetricStatus }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.current),
        hasValue(resourceData.metric),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.current) && (
                <Container title="Current" collapsible defaultOpen={ true }>
                    <MetricValueStatusDetails resourceData={resourceData.current } />
                </Container>
            )}

            {hasValue(resourceData.metric) && (
                <Container title="Metric" collapsible defaultOpen={ true }>
                    <MetricIdentifierDetails resourceData={resourceData.metric } />
                </Container>
            )}

        </>
    )
}
