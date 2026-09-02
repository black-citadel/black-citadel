import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V2MetricStatus } from "@kubernetes/client-node";
import { ContainerResourceMetricStatusDetails } from "../V2ContainerResourceMetricStatus/details";
import { ExternalMetricStatusDetails } from "../V2ExternalMetricStatus/details";
import { ObjectMetricStatusDetails } from "../V2ObjectMetricStatus/details";
import { PodsMetricStatusDetails } from "../V2PodsMetricStatus/details";
import { ResourceMetricStatusDetails } from "../V2ResourceMetricStatus/details";

export const MetricStatusDetails = ({ resourceData }: { resourceData: V2MetricStatus }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.type),
        hasValue(resourceData.containerResource),
        hasValue(resourceData.external),
        hasValue(resourceData.object),
        hasValue(resourceData.pods),
        hasValue(resourceData.resource),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Type", value: resourceData.type, description: "type is the type of metric source." },
                ]}
            />

            {hasValue(resourceData.containerResource) && (
                <Container title="Container Resource" collapsible defaultOpen={ true }>
                    <ContainerResourceMetricStatusDetails resourceData={resourceData.containerResource } />
                </Container>
            )}

            {hasValue(resourceData.external) && (
                <Container title="External" collapsible defaultOpen={ true }>
                    <ExternalMetricStatusDetails resourceData={resourceData.external } />
                </Container>
            )}

            {hasValue(resourceData.object) && (
                <Container title="Object" collapsible defaultOpen={ true }>
                    <ObjectMetricStatusDetails resourceData={resourceData.object } />
                </Container>
            )}

            {hasValue(resourceData.pods) && (
                <Container title="Pods" collapsible defaultOpen={ true }>
                    <PodsMetricStatusDetails resourceData={resourceData.pods } />
                </Container>
            )}

            {hasValue(resourceData.resource) && (
                <Container title="Resource" collapsible defaultOpen={ true }>
                    <ResourceMetricStatusDetails resourceData={resourceData.resource } />
                </Container>
            )}

        </>
    )
}
