import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V2ContainerResourceMetricSource } from "@kubernetes/client-node";
import { MetricTargetDetails } from "../V2MetricTarget/details";

export const ContainerResourceMetricSourceDetails = ({ resourceData }: { resourceData: V2ContainerResourceMetricSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.container),
        hasValue(resourceData.name),
        hasValue(resourceData.target),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Container", value: resourceData.container, description: "container is the name of the container in the pods of the scaling target" },
                    { label: "Name", value: resourceData.name, description: "name is the name of the resource in question." },
                ]}
            />

            {hasValue(resourceData.target) && (
                <Container title="Target" collapsible defaultOpen={ true }>
                    <MetricTargetDetails resourceData={resourceData.target } />
                </Container>
            )}

        </>
    )
}
