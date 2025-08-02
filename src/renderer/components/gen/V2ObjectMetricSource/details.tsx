import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V2ObjectMetricSource, V2CrossVersionObjectReference, V2MetricIdentifier, V2MetricTarget } from "@utils/k8s-types";
import { CrossVersionObjectReferenceDetails } from "../V2CrossVersionObjectReference/details";
import { MetricIdentifierDetails } from "../V2MetricIdentifier/details";
import { MetricTargetDetails } from "../V2MetricTarget/details";

export const ObjectMetricSourceDetails = ({ resourceData }: { resourceData: V2ObjectMetricSource }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check k8s type properties
        checks.push([resourceData.describedObject, resourceData.metric, resourceData.target].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <Container title="Described Object">
                <CrossVersionObjectReferenceDetails resourceData={ resourceData.describedObject } />
            </Container>

            <Container title="Metric">
                <MetricIdentifierDetails resourceData={ resourceData.metric } />
            </Container>

            <Container title="Target">
                <MetricTargetDetails resourceData={ resourceData.target } />
            </Container>

        </>
    )
}