import { PanelGrid, PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1EphemeralContainer } from "@kubernetes/client-node";
import { ContainerPortDetails } from "../V1ContainerPort/details";
import { EnvVarDetails } from "../V1EnvVar/details";
import { EnvFromSourceDetails } from "../V1EnvFromSource/details";
import { ResourceRequirementsDetails } from "../V1ResourceRequirements/details";
import { VolumeMountDetails } from "../V1VolumeMount/details";
import { VolumeDeviceDetails } from "../V1VolumeDevice/details";
import { SecurityContextDetails } from "../V1SecurityContext/details";
import { LifecycleDetails } from "../V1Lifecycle/details";
import { ProbeDetails } from "../V1Probe/details";
import { ContainerResizePolicyDetails } from "../V1ContainerResizePolicy/details";

export const EphemeralContainerDetails = ({ resourceData }: { resourceData: V1EphemeralContainer }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.name),
        hasValue(resourceData.targetContainerName),
        hasValue(resourceData.image),
        hasValue(resourceData.imagePullPolicy),
        hasValue(resourceData.command),
        hasValue(resourceData.args),
        hasValue(resourceData.workingDir),
        hasValue(resourceData.restartPolicy),
        hasValue(resourceData.terminationMessagePath),
        hasValue(resourceData.terminationMessagePolicy),
        resourceData.stdin === true,
        resourceData.stdinOnce === true,
        resourceData.tty === true,
        hasValue(resourceData.ports),
        hasValue(resourceData.env),
        hasValue(resourceData.envFrom),
        hasValue(resourceData.resources),
        hasValue(resourceData.volumeMounts),
        hasValue(resourceData.volumeDevices),
        hasValue(resourceData.securityContext),
        hasValue(resourceData.lifecycle),
        hasValue(resourceData.livenessProbe),
        hasValue(resourceData.readinessProbe),
        hasValue(resourceData.resizePolicy),
        hasValue(resourceData.startupProbe),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Name", value: resourceData.name, description: "Name of the ephemeral container specified as a DNS_LABEL." },
                    { label: "Target Container Name", value: resourceData.targetContainerName, description: "If set, the name of the container from PodSpec that this ephemeral container targets." },
                    { label: "Image", value: resourceData.image, description: "Container image name." },
                    { label: "Image Pull Policy", value: resourceData.imagePullPolicy, description: "Image pull policy." },
                    { label: "Command", value: resourceData.command, description: "Entrypoint array." },
                    { label: "Args", value: resourceData.args, description: "Arguments to the entrypoint." },
                    { label: "Working Dir", value: resourceData.workingDir, description: "Container's working directory." },
                    { label: "Restart Policy", value: resourceData.restartPolicy, description: "Restart policy for the container to manage the restart behavior of each container within a pod." },
                    { label: "Termination Message Path", value: resourceData.terminationMessagePath, description: "Optional: Path at which the file to which the container's termination message will be written is mounted into the container's filesystem." },
                    { label: "Termination Message Policy", value: resourceData.terminationMessagePolicy, description: "Indicate how the termination message should be populated." },
                ]}
                flags={[
                    { label: "Stdin", value: resourceData.stdin, description: "Whether this container should allocate a buffer for stdin in the container runtime." },
                    { label: "Stdin Once", value: resourceData.stdinOnce, description: "Whether the container runtime should close the stdin channel after it has been opened by a single attach." },
                    { label: "Tty", value: resourceData.tty, description: "Whether this container should allocate a TTY for itself, also requires 'stdin' to be true." },
                ]}
            />

            {hasValue(resourceData.ports) && (
                <Container title="Ports" count={resourceData.ports.length} collapsible defaultOpen={ true }>
                    {resourceData.ports.map((item, index) => (
                        <PanelListItem key={index} title={item.name }>
                            <ContainerPortDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.env) && (
                <Container title="Env" count={resourceData.env.length} collapsible defaultOpen={ true }>
                    {resourceData.env.map((item, index) => (
                        <PanelListItem key={index} title={item.name }>
                            <EnvVarDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.envFrom) && (
                <Container title="Env From" count={resourceData.envFrom.length} collapsible defaultOpen={ true }>
                    {resourceData.envFrom.map((item, index) => (
                        <PanelListItem key={index}>
                            <EnvFromSourceDetails resourceData={item} />
                        </PanelListItem>
                    ))}
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
                            <VolumeMountDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.volumeDevices) && (
                <Container title="Volume Devices" count={resourceData.volumeDevices.length} collapsible defaultOpen={ false }>
                    {resourceData.volumeDevices.map((item, index) => (
                        <PanelListItem key={index} title={item.name }>
                            <VolumeDeviceDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.securityContext) && (
                <Container title="Security Context" collapsible defaultOpen={ false }>
                    <SecurityContextDetails resourceData={resourceData.securityContext } />
                </Container>
            )}

            {hasValue(resourceData.lifecycle) && (
                <Container title="Lifecycle" collapsible defaultOpen={ false }>
                    <LifecycleDetails resourceData={resourceData.lifecycle } />
                </Container>
            )}

            {hasValue(resourceData.livenessProbe) && (
                <Container title="Liveness Probe" collapsible defaultOpen={ true }>
                    <ProbeDetails resourceData={resourceData.livenessProbe } />
                </Container>
            )}

            {hasValue(resourceData.readinessProbe) && (
                <Container title="Readiness Probe" collapsible defaultOpen={ true }>
                    <ProbeDetails resourceData={resourceData.readinessProbe } />
                </Container>
            )}

            {hasValue(resourceData.resizePolicy) && (
                <Container title="Resize Policy" count={resourceData.resizePolicy.length} collapsible defaultOpen={ false }>
                    {resourceData.resizePolicy.map((item, index) => (
                        <PanelListItem key={index}>
                            <ContainerResizePolicyDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.startupProbe) && (
                <Container title="Startup Probe" collapsible defaultOpen={ true }>
                    <ProbeDetails resourceData={resourceData.startupProbe } />
                </Container>
            )}

        </>
    )
}
