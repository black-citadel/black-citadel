import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V2MetricSpec, V2ContainerResourceMetricSource, V2ExternalMetricSource, V2ObjectMetricSource, V2PodsMetricSource, V2ResourceMetricSource } from "@utils/k8s-types";
import { ContainerResourceMetricSourceDetails } from "../V2ContainerResourceMetricSource/details";
import { ExternalMetricSourceDetails } from "../V2ExternalMetricSource/details";
import { ObjectMetricSourceDetails } from "../V2ObjectMetricSource/details";
import { PodsMetricSourceDetails } from "../V2PodsMetricSource/details";
import { ResourceMetricSourceDetails } from "../V2ResourceMetricSource/details";

export const MetricSpecDetails = ({ resourceData }: { resourceData: V2MetricSpec }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.type].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.containerResource, resourceData.external, resourceData.object, resourceData.pods, resourceData.resource].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="Properties"
                items={[
                    { label: "Type", value: resourceData.type }
                ]}
                columns={1}
            />

            {resourceData.containerResource && (
                <Container title="Container Resource">
                    <ContainerResourceMetricSourceDetails resourceData={ resourceData.containerResource } />
                </Container>
            )}

            {resourceData.external && (
                <Container title="External">
                    <ExternalMetricSourceDetails resourceData={ resourceData.external } />
                </Container>
            )}

            {resourceData.object && (
                <Container title="Object">
                    <ObjectMetricSourceDetails resourceData={ resourceData.object } />
                </Container>
            )}

            {resourceData.pods && (
                <Container title="Pods">
                    <PodsMetricSourceDetails resourceData={ resourceData.pods } />
                </Container>
            )}

            {resourceData.resource && (
                <Container title="Resource">
                    <ResourceMetricSourceDetails resourceData={ resourceData.resource } />
                </Container>
            )}

        </>
    )
}