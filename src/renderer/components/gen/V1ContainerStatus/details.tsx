import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1ContainerStatus } from "@kubernetes/client-node";
import { ContainerStateDetails } from "../V1ContainerState/details";
import { ResourceRequirementsDetails } from "../V1ResourceRequirements/details";
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
        const checks: boolean[] = [];
        // Check object properties
        checks.push(allocatedResourcesItems.length > 0);
        // Check simple properties
        checks.push([resourceData.containerID, resourceData.image, resourceData.imageID, resourceData.name, resourceData.restartCount].some(v => v !== undefined && v !== null));
        // Boolean properties always have content
        checks.push(true);
        // Check k8s type properties
        checks.push([resourceData.lastState, resourceData.resources, resourceData.state, resourceData.volumeMounts].some(v => v !== undefined && v !== null));
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
                    { label: "Restart Count", value: resourceData.restartCount }
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