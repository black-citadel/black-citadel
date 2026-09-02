import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V2ExternalMetricSource } from "@kubernetes/client-node";
import { MetricIdentifierDetails } from "../V2MetricIdentifier/details";
import { MetricTargetDetails } from "../V2MetricTarget/details";

export const ExternalMetricSourceDetails = ({ resourceData }: { resourceData: V2ExternalMetricSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.metric),
        hasValue(resourceData.target),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
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
