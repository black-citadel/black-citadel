import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { V1EphemeralContainer } from "@utils/k8s-types";
import { EnvVarDetails } from "../V1EnvVar/details";
import { EnvFromSourceDetails } from "../V1EnvFromSource/details";
import { LifecycleDetails } from "../V1Lifecycle/details";
import { ProbeDetails } from "../V1Probe/details";
import { ContainerPortDetails } from "../V1ContainerPort/details";
import { ContainerResizePolicyDetails } from "../V1ContainerResizePolicy/details";
import { ResourceRequirementsDetails } from "../V1ResourceRequirements/details";
import { SecurityContextDetails } from "../V1SecurityContext/details";
import { VolumeDeviceDetails } from "../V1VolumeDevice/details";
import { VolumeMountDetails } from "../V1VolumeMount/details";

export const EphemeralContainerDetails = ({ resourceData }: { resourceData: V1EphemeralContainer }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.image, resourceData.imagePullPolicy, resourceData.name, resourceData.restartPolicy, resourceData.targetContainerName, resourceData.terminationMessagePath, resourceData.terminationMessagePolicy, resourceData.workingDir].some(v => v !== undefined && v !== null));
        // Boolean properties always have content
        checks.push(true);
        // Check k8s type properties
        checks.push([resourceData.env, resourceData.envFrom, resourceData.lifecycle, resourceData.livenessProbe, resourceData.ports, resourceData.readinessProbe, resourceData.resizePolicy, resourceData.resources, resourceData.securityContext, resourceData.startupProbe, resourceData.volumeDevices, resourceData.volumeMounts].some(v => v !== undefined && v !== null));
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
                    { label: "Image", value: resourceData.image || '-' },
                    { label: "Image Pull Policy", value: resourceData.imagePullPolicy || '-' },
                    { label: "Name", value: resourceData.name },
                    { label: "Restart Policy", value: resourceData.restartPolicy || '-' },
                    { label: "Target Container Name", value: resourceData.targetContainerName || '-' },
                    { label: "Termination Message Path", value: resourceData.terminationMessagePath || '-' },
                    { label: "Termination Message Policy", value: resourceData.terminationMessagePolicy || '-' },
                    { label: "Working Dir", value: resourceData.workingDir || '-' }
                ]}
                columns={1}
            />

            <PanelGrid
                title="Configuration"
                items={[
                    { label: "Stdin", value: resourceData.stdin ? "Yes" : "No" },
                    { label: "Stdin Once", value: resourceData.stdinOnce ? "Yes" : "No" },
                    { label: "Tty", value: resourceData.tty ? "Yes" : "No" }
                ]}
                columns={1}
            />

            {resourceData.env && (
                <Container title="Env">
                    {resourceData.env.map((item, index) => (
                        <EnvVarDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.envFrom && (
                <Container title="Env From">
                    {resourceData.envFrom.map((item, index) => (
                        <EnvFromSourceDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.lifecycle && (
                <Container title="Lifecycle">
                    <LifecycleDetails resourceData={ resourceData.lifecycle } />
                </Container>
            )}

            {resourceData.livenessProbe && (
                <Container title="Liveness Probe">
                    <ProbeDetails resourceData={ resourceData.livenessProbe } />
                </Container>
            )}

            {resourceData.ports && (
                <Container title="Ports">
                    {resourceData.ports.map((item, index) => (
                        <ContainerPortDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.readinessProbe && (
                <Container title="Readiness Probe">
                    <ProbeDetails resourceData={ resourceData.readinessProbe } />
                </Container>
            )}

            {resourceData.resizePolicy && (
                <Container title="Resize Policy">
                    {resourceData.resizePolicy.map((item, index) => (
                        <ContainerResizePolicyDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.resources && (
                <Container title="Resources">
                    <ResourceRequirementsDetails resourceData={ resourceData.resources } />
                </Container>
            )}

            {resourceData.securityContext && (
                <Container title="Security Context">
                    <SecurityContextDetails resourceData={ resourceData.securityContext } />
                </Container>
            )}

            {resourceData.startupProbe && (
                <Container title="Startup Probe">
                    <ProbeDetails resourceData={ resourceData.startupProbe } />
                </Container>
            )}

            {resourceData.volumeDevices && (
                <Container title="Volume Devices">
                    {resourceData.volumeDevices.map((item, index) => (
                        <VolumeDeviceDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.volumeMounts && (
                <Container title="Volume Mounts">
                    {resourceData.volumeMounts.map((item, index) => (
                        <VolumeMountDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}