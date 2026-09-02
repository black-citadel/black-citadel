import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V2MetricStatus } from "@kubernetes/client-node";
import { ContainerResourceMetricStatusDetails } from "../V2ContainerResourceMetricStatus/details";
import { ExternalMetricStatusDetails } from "../V2ExternalMetricStatus/details";
import { ObjectMetricStatusDetails } from "../V2ObjectMetricStatus/details";
import { PodsMetricStatusDetails } from "../V2PodsMetricStatus/details";
import { ResourceMetricStatusDetails } from "../V2ResourceMetricStatus/details";

export const MetricStatusDetails = ({ resourceData }: { resourceData: V2MetricStatus }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
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
                    <ContainerResourceMetricStatusDetails resourceData={ resourceData.containerResource } />
                </Container>
            )}

            {resourceData.external && (
                <Container title="External">
                    <ExternalMetricStatusDetails resourceData={ resourceData.external } />
                </Container>
            )}

            {resourceData.object && (
                <Container title="Object">
                    <ObjectMetricStatusDetails resourceData={ resourceData.object } />
                </Container>
            )}

            {resourceData.pods && (
                <Container title="Pods">
                    <PodsMetricStatusDetails resourceData={ resourceData.pods } />
                </Container>
            )}

            {resourceData.resource && (
                <Container title="Resource">
                    <ResourceMetricStatusDetails resourceData={ resourceData.resource } />
                </Container>
            )}

        </>
    )
}