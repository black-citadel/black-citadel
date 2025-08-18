import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { V1PodSpec } from "@utils/k8s-types";
import { AffinityDetails } from "../V1Affinity/details";
import { ContainerDetails } from "../V1Container/details";
import { PodDNSConfigDetails } from "../V1PodDNSConfig/details";
import { EphemeralContainerDetails } from "../V1EphemeralContainer/details";
import { HostAliasDetails } from "../V1HostAlias/details";
import { LocalObjectReferenceDetails } from "../V1LocalObjectReference/details";
import { PodOSDetails } from "../V1PodOS/details";
import { PodReadinessGateDetails } from "../V1PodReadinessGate/details";
import { PodResourceClaimDetails } from "../V1PodResourceClaim/details";
import { ResourceRequirementsDetails } from "../V1ResourceRequirements/details";
import { PodSchedulingGateDetails } from "../V1PodSchedulingGate/details";
import { PodSecurityContextDetails } from "../V1PodSecurityContext/details";
import { TolerationDetails } from "../V1Toleration/details";
import { TopologySpreadConstraintDetails } from "../V1TopologySpreadConstraint/details";
import { VolumeDetails } from "../V1Volume/details";

export const PodSpecDetails = ({ resourceData }: { resourceData: V1PodSpec }): JSX.Element => {
    // Transform the Node Selector object into an array of PanelGridItem objects
    const nodeSelectorItems = resourceData.nodeSelector
        ? Object.entries(resourceData.nodeSelector).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];
    // Transform the Overhead object into an array of PanelGridItem objects
    const overheadItems = resourceData.overhead
        ? Object.entries(resourceData.overhead).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check object properties
        checks.push(nodeSelectorItems.length > 0 || overheadItems.length > 0);
        // Check simple properties
        checks.push([resourceData.activeDeadlineSeconds, resourceData.dnsPolicy, resourceData.hostname, resourceData.nodeName, resourceData.preemptionPolicy, resourceData.priority, resourceData.priorityClassName, resourceData.restartPolicy, resourceData.runtimeClassName, resourceData.schedulerName, resourceData.serviceAccount, resourceData.serviceAccountName, resourceData.subdomain, resourceData.terminationGracePeriodSeconds].some(v => v !== undefined && v !== null));
        // Boolean properties always have content
        checks.push(true);
        // Check k8s type properties
        checks.push([resourceData.affinity, resourceData.containers, resourceData.dnsConfig, resourceData.ephemeralContainers, resourceData.hostAliases, resourceData.imagePullSecrets, resourceData.initContainers, resourceData.os, resourceData.readinessGates, resourceData.resourceClaims, resourceData.schedulingGates, resourceData.securityContext, resourceData.tolerations, resourceData.topologySpreadConstraints, resourceData.volumes].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="Node Selector"
                items={ nodeSelectorItems }
                columns={1}
            />

            <PanelGrid
                title="Overhead"
                items={ overheadItems }
                columns={1}
            />

            <PanelGrid
                title="Properties"
                items={[
                    { label: "Active Deadline Seconds", value: resourceData.activeDeadlineSeconds || '-' },
                    { label: "Dns Policy", value: resourceData.dnsPolicy || '-' },
                    { label: "Hostname", value: resourceData.hostname || '-' },
                    { label: "Node Name", value: resourceData.nodeName || '-' },
                    { label: "Preemption Policy", value: resourceData.preemptionPolicy || '-' },
                    { label: "Priority", value: resourceData.priority || '-' },
                    { label: "Priority Class Name", value: resourceData.priorityClassName || '-' },
                    { label: "Restart Policy", value: resourceData.restartPolicy || '-' },
                    { label: "Runtime Class Name", value: resourceData.runtimeClassName || '-' },
                    { label: "Scheduler Name", value: resourceData.schedulerName || '-' },
                    { label: "Service Account", value: resourceData.serviceAccount || '-' },
                    { label: "Service Account Name", value: resourceData.serviceAccountName || '-' },
                    { label: "Subdomain", value: resourceData.subdomain || '-' },
                    { label: "Termination Grace Period Seconds", value: resourceData.terminationGracePeriodSeconds || '-' }
                ]}
                columns={1}
            />

            <PanelGrid
                title="Configuration"
                items={[
                    { label: "Automount Service Account Token", value: resourceData.automountServiceAccountToken ? "Yes" : "No" },
                    { label: "Enable Service Links", value: resourceData.enableServiceLinks ? "Yes" : "No" },
                    { label: "Host IPC", value: resourceData.hostIPC ? "Yes" : "No" },
                    { label: "Host Network", value: resourceData.hostNetwork ? "Yes" : "No" },
                    { label: "Host PID", value: resourceData.hostPID ? "Yes" : "No" },
                    { label: "Host Users", value: resourceData.hostUsers ? "Yes" : "No" },
                    { label: "Set Hostname As FQDN", value: resourceData.setHostnameAsFQDN ? "Yes" : "No" },
                    { label: "Share Process Namespace", value: resourceData.shareProcessNamespace ? "Yes" : "No" }
                ]}
                columns={1}
            />

            {resourceData.affinity && (
                <Container title="Affinity">
                    <AffinityDetails resourceData={ resourceData.affinity } />
                </Container>
            )}

            {resourceData.containers && (
                <Container title="Containers">
                    {resourceData.containers.map((item, index) => (
                        <ContainerDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.dnsConfig && (
                <Container title="Dns Config">
                    <PodDNSConfigDetails resourceData={ resourceData.dnsConfig } />
                </Container>
            )}

            {resourceData.ephemeralContainers && (
                <Container title="Ephemeral Containers">
                    {resourceData.ephemeralContainers.map((item, index) => (
                        <EphemeralContainerDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.hostAliases && (
                <Container title="Host Aliases">
                    {resourceData.hostAliases.map((item, index) => (
                        <HostAliasDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.imagePullSecrets && (
                <Container title="Image Pull Secrets">
                    {resourceData.imagePullSecrets.map((item, index) => (
                        <LocalObjectReferenceDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.initContainers && (
                <Container title="Init Containers">
                    {resourceData.initContainers.map((item, index) => (
                        <ContainerDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.os && (
                <Container title="Os">
                    <PodOSDetails resourceData={ resourceData.os } />
                </Container>
            )}

            {resourceData.readinessGates && (
                <Container title="Readiness Gates">
                    {resourceData.readinessGates.map((item, index) => (
                        <PodReadinessGateDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.resourceClaims && (
                <Container title="Resource Claims">
                    {resourceData.resourceClaims.map((item, index) => (
                        <PodResourceClaimDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.schedulingGates && (
                <Container title="Scheduling Gates">
                    {resourceData.schedulingGates.map((item, index) => (
                        <PodSchedulingGateDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.securityContext && (
                <Container title="Security Context">
                    <PodSecurityContextDetails resourceData={ resourceData.securityContext } />
                </Container>
            )}

            {resourceData.tolerations && (
                <Container title="Tolerations">
                    {resourceData.tolerations.map((item, index) => (
                        <TolerationDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.topologySpreadConstraints && (
                <Container title="Topology Spread Constraints">
                    {resourceData.topologySpreadConstraints.map((item, index) => (
                        <TopologySpreadConstraintDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.volumes && (
                <Container title="Volumes">
                    {resourceData.volumes.map((item, index) => (
                        <VolumeDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}