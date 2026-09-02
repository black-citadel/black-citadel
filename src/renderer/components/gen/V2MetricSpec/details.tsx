import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V2MetricSpec } from "@kubernetes/client-node";
import { ContainerResourceMetricSourceDetails } from "../V2ContainerResourceMetricSource/details";
import { ExternalMetricSourceDetails } from "../V2ExternalMetricSource/details";
import { ObjectMetricSourceDetails } from "../V2ObjectMetricSource/details";
import { PodsMetricSourceDetails } from "../V2PodsMetricSource/details";
import { ResourceMetricSourceDetails } from "../V2ResourceMetricSource/details";

export const MetricSpecDetails = ({ resourceData }: { resourceData: V2MetricSpec }): JSX.Element => {

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
                    <ContainerResourceMetricSourceDetails resourceData={resourceData.containerResource } />
                </Container>
            )}

            {hasValue(resourceData.external) && (
                <Container title="External" collapsible defaultOpen={ true }>
                    <ExternalMetricSourceDetails resourceData={resourceData.external } />
                </Container>
            )}

            {hasValue(resourceData.object) && (
                <Container title="Object" collapsible defaultOpen={ true }>
                    <ObjectMetricSourceDetails resourceData={resourceData.object } />
                </Container>
            )}

            {hasValue(resourceData.pods) && (
                <Container title="Pods" collapsible defaultOpen={ true }>
                    <PodsMetricSourceDetails resourceData={resourceData.pods } />
                </Container>
            )}

            {hasValue(resourceData.resource) && (
                <Container title="Resource" collapsible defaultOpen={ true }>
                    <ResourceMetricSourceDetails resourceData={resourceData.resource } />
                </Container>
            )}

        </>
    )
}
