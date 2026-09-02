import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V2ContainerResourceMetricStatus } from "@kubernetes/client-node";
import { MetricValueStatusDetails } from "../V2MetricValueStatus/details";

export const ContainerResourceMetricStatusDetails = ({ resourceData }: { resourceData: V2ContainerResourceMetricStatus }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.container),
        hasValue(resourceData.name),
        hasValue(resourceData.current),
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

            {hasValue(resourceData.current) && (
                <Container title="Current" collapsible defaultOpen={ true }>
                    <MetricValueStatusDetails resourceData={resourceData.current } />
                </Container>
            )}

        </>
    )
}
