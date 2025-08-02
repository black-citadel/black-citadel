import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1ContainerStatus, V1ResourceStatus, V1ContainerState, V1ResourceRequirements, V1ContainerUser, V1VolumeMountStatus } from "@utils/k8s-types";
import { ResourceStatusDetails } from "../V1ResourceStatus/details";
import { ContainerStateDetails } from "../V1ContainerState/details";
import { ResourceRequirementsDetails } from "../V1ResourceRequirements/details";
import { ContainerUserDetails } from "../V1ContainerUser/details";
import { VolumeMountStatusDetails } from "../V1VolumeMountStatus/details";

export const ContainerStatusDetails = ({ resourceData }: { resourceData: V1ContainerStatus }): JSX.Element => {
    // Transform the Allocated Resources object into an array of PanelGridItem objects
    const allocatedResourcesItems = resourceData.allocatedResources
        ? Object.entries(resourceData.allocatedResources).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check object properties
        checks.push(allocatedResourcesItems.length > 0);
        // Check simple properties
        checks.push([resourceData.containerID, resourceData.image, resourceData.imageID, resourceData.name, resourceData.restartCount, resourceData.stopSignal].some(v => v !== undefined && v !== null));
        // Boolean properties always have content
        checks.push(true);
        // Check k8s type properties
        checks.push([resourceData.allocatedResourcesStatus, resourceData.lastState, resourceData.resources, resourceData.state, resourceData.user, resourceData.volumeMounts].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="Allocated Resources"
                items={ allocatedResourcesItems }
                columns={1}
            />

            <PanelGrid
                title="Properties"
                items={[
                    { label: "Container ID", value: resourceData.containerID || '-' },
                    { label: "Image", value: resourceData.image },
                    { label: "Image ID", value: resourceData.imageID },
                    { label: "Name", value: resourceData.name },
                    { label: "Restart Count", value: resourceData.restartCount },
                    { label: "Stop Signal", value: resourceData.stopSignal || '-' }
                ]}
                columns={1}
            />

            <PanelGrid
                title="Configuration"
                items={[
                    { label: "Ready", value: resourceData.ready ? "Yes" : "No" },
                    { label: "Started", value: resourceData.started ? "Yes" : "No" }
                ]}
                columns={1}
            />

            {resourceData.allocatedResourcesStatus && (
                <Container title="Allocated Resources Status">
                    {resourceData.allocatedResourcesStatus.map((item, index) => (
                        <ResourceStatusDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.lastState && (
                <Container title="Last State">
                    <ContainerStateDetails resourceData={ resourceData.lastState } />
                </Container>
            )}

            {resourceData.resources && (
                <Container title="Resources">
                    <ResourceRequirementsDetails resourceData={ resourceData.resources } />
                </Container>
            )}

            {resourceData.state && (
                <Container title="State">
                    <ContainerStateDetails resourceData={ resourceData.state } />
                </Container>
            )}

            {resourceData.user && (
                <Container title="User">
                    <ContainerUserDetails resourceData={ resourceData.user } />
                </Container>
            )}

            {resourceData.volumeMounts && (
                <Container title="Volume Mounts">
                    {resourceData.volumeMounts.map((item, index) => (
                        <VolumeMountStatusDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}