import { PanelGrid, PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1PodSpec } from "@kubernetes/client-node";
import { ContainerDetails } from "../V1Container/details";
import { EphemeralContainerDetails } from "../V1EphemeralContainer/details";
import { VolumesTable } from "@components/workloads/pod/volumes-table";
import { PodDNSConfigDetails } from "../V1PodDNSConfig/details";
import { AffinityDetails } from "../V1Affinity/details";
import { TolerationDetails } from "../V1Toleration/details";
import { TopologySpreadConstraintDetails } from "../V1TopologySpreadConstraint/details";
import { PodSchedulingGateDetails } from "../V1PodSchedulingGate/details";
import { PodSecurityContextDetails } from "../V1PodSecurityContext/details";
import { LocalObjectReferenceDetails } from "../V1LocalObjectReference/details";
import { HostAliasDetails } from "../V1HostAlias/details";
import { PodReadinessGateDetails } from "../V1PodReadinessGate/details";
import { PodResourceClaimDetails } from "../V1PodResourceClaim/details";
import { PodOSDetails } from "../V1PodOS/details";

export const PodSpecDetails = ({ resourceData }: { resourceData: V1PodSpec }): JSX.Element => {
    const nodeSelectorItems = Object.entries(resourceData.nodeSelector ?? {}).map(([key, value]) => ({ label: key, value }));
    const overheadItems = Object.entries(resourceData.overhead ?? {}).map(([key, value]) => ({ label: key, value }));

    const hasContent = [
        nodeSelectorItems.length > 0,
        overheadItems.length > 0,
        hasValue(resourceData.serviceAccountName),
        hasValue(resourceData.serviceAccount),
        hasValue(resourceData.restartPolicy),
        hasValue(resourceData.terminationGracePeriodSeconds),
        hasValue(resourceData.activeDeadlineSeconds),
        hasValue(resourceData.dnsPolicy),
        hasValue(resourceData.hostname),
        hasValue(resourceData.subdomain),
        hasValue(resourceData.nodeName),
        hasValue(resourceData.priorityClassName),
        hasValue(resourceData.priority),
        hasValue(resourceData.preemptionPolicy),
        hasValue(resourceData.schedulerName),
        hasValue(resourceData.runtimeClassName),
        resourceData.automountServiceAccountToken === true,
        resourceData.enableServiceLinks === true,
        resourceData.hostIPC === true,
        resourceData.hostNetwork === true,
        resourceData.hostPID === true,
        resourceData.hostUsers === true,
        resourceData.setHostnameAsFQDN === true,
        resourceData.shareProcessNamespace === true,
        hasValue(resourceData.containers),
        hasValue(resourceData.initContainers),
        hasValue(resourceData.ephemeralContainers),
        hasValue(resourceData.volumes),
        hasValue(resourceData.dnsConfig),
        hasValue(resourceData.affinity),
        hasValue(resourceData.tolerations),
        hasValue(resourceData.topologySpreadConstraints),
        hasValue(resourceData.schedulingGates),
        hasValue(resourceData.securityContext),
        hasValue(resourceData.imagePullSecrets),
        hasValue(resourceData.hostAliases),
        hasValue(resourceData.readinessGates),
        hasValue(resourceData.resourceClaims),
        hasValue(resourceData.os),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Service Account Name", value: resourceData.serviceAccountName, description: "ServiceAccountName is the name of the ServiceAccount to use to run this pod." },
                    { label: "Service Account", value: resourceData.serviceAccount, description: "DeprecatedServiceAccount is a deprecated alias for ServiceAccountName." },
                    { label: "Restart Policy", value: resourceData.restartPolicy, description: "Restart policy for all containers within the pod." },
                    { label: "Termination Grace Period Seconds", value: resourceData.terminationGracePeriodSeconds, description: "Optional duration in seconds the pod needs to terminate gracefully." },
                    { label: "Active Deadline Seconds", value: resourceData.activeDeadlineSeconds, description: "Optional duration in seconds the pod may be active on the node relative to StartTime before the system will actively try to mark it failed and kill associated…" },
                    { label: "Dns Policy", value: resourceData.dnsPolicy, description: "Set DNS policy for the pod." },
                    { label: "Hostname", value: resourceData.hostname, description: "Specifies the hostname of the Pod If not specified, the pod's hostname will be set to a system-defined value." },
                    { label: "Subdomain", value: resourceData.subdomain, description: "If specified, the fully qualified Pod hostname will be \"<hostname>.<subdomain>.<pod namespace>.svc.<cluster domain>\"." },
                    { label: "Node Name", value: resourceData.nodeName, description: "NodeName is a request to schedule this pod onto a specific node." },
                    { label: "Priority Class Name", value: resourceData.priorityClassName, description: "If specified, indicates the pod's priority." },
                    { label: "Priority", value: resourceData.priority, description: "The priority value." },
                    { label: "Preemption Policy", value: resourceData.preemptionPolicy, description: "PreemptionPolicy is the Policy for preempting pods with lower priority." },
                    { label: "Scheduler Name", value: resourceData.schedulerName, description: "If specified, the pod will be dispatched by specified scheduler." },
                    { label: "Runtime Class Name", value: resourceData.runtimeClassName, description: "RuntimeClassName refers to a RuntimeClass object in the node.k8s.io group, which should be used to run this pod." },
                ]}
                flags={[
                    { label: "Automount Service Account Token", value: resourceData.automountServiceAccountToken, description: "AutomountServiceAccountToken indicates whether a service account token should be automatically mounted." },
                    { label: "Enable Service Links", value: resourceData.enableServiceLinks, description: "EnableServiceLinks indicates whether information about services should be injected into pod's environment variables, matching the syntax of Docker links." },
                    { label: "Host IPC", value: resourceData.hostIPC, description: "Use the host's ipc namespace." },
                    { label: "Host Network", value: resourceData.hostNetwork, description: "Host networking requested for this pod." },
                    { label: "Host PID", value: resourceData.hostPID, description: "Use the host's pid namespace." },
                    { label: "Host Users", value: resourceData.hostUsers, description: "Use the host's user namespace." },
                    { label: "Set Hostname As FQDN", value: resourceData.setHostnameAsFQDN, description: "If true the pod's hostname will be configured as the pod's FQDN, rather than the leaf name (the default)." },
                    { label: "Share Process Namespace", value: resourceData.shareProcessNamespace, description: "Share a single process namespace between all of the containers in a pod." },
                ]}
            />

            <PanelGrid title="Node Selector" items={ nodeSelectorItems } />

            <PanelGrid title="Overhead" items={ overheadItems } />

            {hasValue(resourceData.containers) && (
                <Container title="Containers" count={resourceData.containers.length} collapsible defaultOpen={ true }>
                    {resourceData.containers.map((item, index) => (
                        <PanelListItem key={index} title={item.name }>
                            <ContainerDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.initContainers) && (
                <Container title="Init Containers" count={resourceData.initContainers.length} collapsible defaultOpen={ true }>
                    {resourceData.initContainers.map((item, index) => (
                        <PanelListItem key={index} title={item.name }>
                            <ContainerDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.ephemeralContainers) && (
                <Container title="Ephemeral Containers" count={resourceData.ephemeralContainers.length} collapsible defaultOpen={ true }>
                    {resourceData.ephemeralContainers.map((item, index) => (
                        <PanelListItem key={index} title={item.name }>
                            <EphemeralContainerDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.volumes) && (
                <Container title="Volumes" count={resourceData.volumes.length} collapsible defaultOpen={ true }>
                    <VolumesTable volumes={resourceData.volumes } />
                </Container>
            )}

            {hasValue(resourceData.dnsConfig) && (
                <Container title="Dns Config" collapsible defaultOpen={ false }>
                    <PodDNSConfigDetails resourceData={resourceData.dnsConfig } />
                </Container>
            )}

            {hasValue(resourceData.affinity) && (
                <Container title="Affinity" collapsible defaultOpen={ false }>
                    <AffinityDetails resourceData={resourceData.affinity } />
                </Container>
            )}

            {hasValue(resourceData.tolerations) && (
                <Container title="Tolerations" count={resourceData.tolerations.length} collapsible defaultOpen={ false }>
                    {resourceData.tolerations.map((item, index) => (
                        <PanelListItem key={index}>
                            <TolerationDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.topologySpreadConstraints) && (
                <Container title="Topology Spread Constraints" count={resourceData.topologySpreadConstraints.length} collapsible defaultOpen={ false }>
                    {resourceData.topologySpreadConstraints.map((item, index) => (
                        <PanelListItem key={index}>
                            <TopologySpreadConstraintDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.schedulingGates) && (
                <Container title="Scheduling Gates" count={resourceData.schedulingGates.length} collapsible defaultOpen={ false }>
                    {resourceData.schedulingGates.map((item, index) => (
                        <PanelListItem key={index} title={item.name }>
                            <PodSchedulingGateDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.securityContext) && (
                <Container title="Security Context" collapsible defaultOpen={ false }>
                    <PodSecurityContextDetails resourceData={resourceData.securityContext } />
                </Container>
            )}

            {hasValue(resourceData.imagePullSecrets) && (
                <Container title="Image Pull Secrets" count={resourceData.imagePullSecrets.length} collapsible defaultOpen={ false }>
                    {resourceData.imagePullSecrets.map((item, index) => (
                        <PanelListItem key={index} title={item.name }>
                            <LocalObjectReferenceDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.hostAliases) && (
                <Container title="Host Aliases" count={resourceData.hostAliases.length} collapsible defaultOpen={ false }>
                    {resourceData.hostAliases.map((item, index) => (
                        <PanelListItem key={index}>
                            <HostAliasDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.readinessGates) && (
                <Container title="Readiness Gates" count={resourceData.readinessGates.length} collapsible defaultOpen={ false }>
                    {resourceData.readinessGates.map((item, index) => (
                        <PanelListItem key={index}>
                            <PodReadinessGateDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.resourceClaims) && (
                <Container title="Resource Claims" count={resourceData.resourceClaims.length} collapsible defaultOpen={ false }>
                    {resourceData.resourceClaims.map((item, index) => (
                        <PanelListItem key={index} title={item.name }>
                            <PodResourceClaimDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.os) && (
                <Container title="Os" collapsible defaultOpen={ false }>
                    <PodOSDetails resourceData={resourceData.os } />
                </Container>
            )}

        </>
    )
}
