import { PanelGrid, PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1ContainerStatus } from "@kubernetes/client-node";
import { ContainerStateDetails } from "../V1ContainerState/details";
import { ResourceRequirementsDetails } from "../V1ResourceRequirements/details";
import { VolumeMountStatusDetails } from "../V1VolumeMountStatus/details";

export const ContainerStatusDetails = ({ resourceData }: { resourceData: V1ContainerStatus }): JSX.Element => {
    const allocatedResourcesItems = Object.entries(resourceData.allocatedResources ?? {}).map(([key, value]) => ({ label: key, value }));

    const hasContent = [
        allocatedResourcesItems.length > 0,
        hasValue(resourceData.name),
        hasValue(resourceData.restartCount),
        hasValue(resourceData.image),
        hasValue(resourceData.imageID),
        hasValue(resourceData.containerID),
        resourceData.ready === true,
        resourceData.started === true,
        hasValue(resourceData.state),
        hasValue(resourceData.lastState),
        hasValue(resourceData.resources),
        hasValue(resourceData.volumeMounts),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Name", value: resourceData.name, description: "Name is a DNS_LABEL representing the unique name of the container." },
                    { label: "Restart Count", value: resourceData.restartCount, description: "RestartCount holds the number of times the container has been restarted." },
                    { label: "Image", value: resourceData.image, description: "Image is the name of container image that the container is running." },
                    { label: "Image ID", value: resourceData.imageID, description: "ImageID is the image ID of the container's image." },
                    { label: "Container ID", value: resourceData.containerID, description: "ContainerID is the ID of the container in the format '<type>://<container_id>'." },
                ]}
                flags={[
                    { label: "Ready", value: resourceData.ready, description: "Ready specifies whether the container is currently passing its readiness check." },
                    { label: "Started", value: resourceData.started, description: "Started indicates whether the container has finished its postStart lifecycle hook and passed its startup probe." },
                ]}
            />

            <PanelGrid title="Allocated Resources" items={ allocatedResourcesItems } />

            {hasValue(resourceData.state) && (
                <Container title="State" collapsible defaultOpen={ true }>
                    <ContainerStateDetails resourceData={resourceData.state } />
                </Container>
            )}

            {hasValue(resourceData.lastState) && (
                <Container title="Last State" collapsible defaultOpen={ false }>
                    <ContainerStateDetails resourceData={resourceData.lastState } />
                </Container>
            )}

            {hasValue(resourceData.resources) && (
                <Container title="Resources" collapsible defaultOpen={ true }>
                    <ResourceRequirementsDetails resourceData={resourceData.resources } />
                </Container>
            )}

            {hasValue(resourceData.volumeMounts) && (
                <Container title="Volume Mounts" count={resourceData.volumeMounts.length} collapsible defaultOpen={ true }>
                    {resourceData.volumeMounts.map((item, index) => (
                        <PanelListItem key={index} title={item.name }>
                            <VolumeMountStatusDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
