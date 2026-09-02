import { PanelGrid, PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1PodStatus } from "@kubernetes/client-node";
import { PodIPDetails } from "../V1PodIP/details";
import { HostIPDetails } from "../V1HostIP/details";
import { ContainerStatusDetails } from "../V1ContainerStatus/details";
import { ConditionsTable } from "@components/base/conditions-table";
import { PodResourceClaimStatusDetails } from "../V1PodResourceClaimStatus/details";

export const PodStatusDetails = ({ resourceData }: { resourceData: V1PodStatus }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.phase),
        hasValue(resourceData.message),
        hasValue(resourceData.reason),
        hasValue(resourceData.podIP),
        hasValue(resourceData.hostIP),
        hasValue(resourceData.startTime),
        hasValue(resourceData.qosClass),
        hasValue(resourceData.nominatedNodeName),
        hasValue(resourceData.resize),
        hasValue(resourceData.podIPs),
        hasValue(resourceData.hostIPs),
        hasValue(resourceData.containerStatuses),
        hasValue(resourceData.initContainerStatuses),
        hasValue(resourceData.ephemeralContainerStatuses),
        hasValue(resourceData.conditions),
        hasValue(resourceData.resourceClaimStatuses),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Phase", value: resourceData.phase, description: "The phase of a Pod is a simple, high-level summary of where the Pod is in its lifecycle." },
                    { label: "Message", value: resourceData.message, description: "A human readable message indicating details about why the pod is in this condition." },
                    { label: "Reason", value: resourceData.reason, description: "A brief CamelCase message indicating details about why the pod is in this state." },
                    { label: "Pod IP", value: resourceData.podIP, description: "podIP address allocated to the pod." },
                    { label: "Host IP", value: resourceData.hostIP, description: "hostIP holds the IP address of the host to which the pod is assigned." },
                    { label: "Start Time", value: resourceData.startTime, description: "RFC 3339 date and time at which the object was acknowledged by the Kubelet." },
                    { label: "Qos Class", value: resourceData.qosClass, description: "The Quality of Service (QOS) classification assigned to the pod based on resource requirements See PodQOSClass type for available QOS classes More info: https:…" },
                    { label: "Nominated Node Name", value: resourceData.nominatedNodeName, description: "nominatedNodeName is set only when this pod preempts other pods on the node, but it cannot be scheduled right away as preemption victims receive their graceful…" },
                    { label: "Resize", value: resourceData.resize, description: "Status of resources resize desired for pod's containers." },
                ]}
            />

            {hasValue(resourceData.podIPs) && (
                <Container title="Pod IPs" count={resourceData.podIPs.length} collapsible defaultOpen={ true }>
                    {resourceData.podIPs.map((item, index) => (
                        <PanelListItem key={index}>
                            <PodIPDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.hostIPs) && (
                <Container title="Host IPs" count={resourceData.hostIPs.length} collapsible defaultOpen={ true }>
                    {resourceData.hostIPs.map((item, index) => (
                        <PanelListItem key={index}>
                            <HostIPDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.containerStatuses) && (
                <Container title="Container Statuses" count={resourceData.containerStatuses.length} collapsible defaultOpen={ true }>
                    {resourceData.containerStatuses.map((item, index) => (
                        <PanelListItem key={index} title={item.name }>
                            <ContainerStatusDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.initContainerStatuses) && (
                <Container title="Init Container Statuses" count={resourceData.initContainerStatuses.length} collapsible defaultOpen={ true }>
                    {resourceData.initContainerStatuses.map((item, index) => (
                        <PanelListItem key={index} title={item.name }>
                            <ContainerStatusDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.ephemeralContainerStatuses) && (
                <Container title="Ephemeral Container Statuses" count={resourceData.ephemeralContainerStatuses.length} collapsible defaultOpen={ true }>
                    {resourceData.ephemeralContainerStatuses.map((item, index) => (
                        <PanelListItem key={index} title={item.name }>
                            <ContainerStatusDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.conditions) && <ConditionsTable conditions={resourceData.conditions } />}

            {hasValue(resourceData.resourceClaimStatuses) && (
                <Container title="Resource Claim Statuses" count={resourceData.resourceClaimStatuses.length} collapsible defaultOpen={ true }>
                    {resourceData.resourceClaimStatuses.map((item, index) => (
                        <PanelListItem key={index} title={item.name }>
                            <PodResourceClaimStatusDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
