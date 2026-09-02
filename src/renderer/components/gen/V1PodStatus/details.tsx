import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1PodStatus } from "@kubernetes/client-node";
import { ConditionsTable } from "@components/base/conditions-table";
import { ContainerStatusDetails } from "../V1ContainerStatus/details";
import { HostIPDetails } from "../V1HostIP/details";
import { PodIPDetails } from "../V1PodIP/details";
import { PodResourceClaimStatusDetails } from "../V1PodResourceClaimStatus/details";

export const PodStatusDetails = ({ resourceData }: { resourceData: V1PodStatus }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.hostIP, resourceData.message, resourceData.nominatedNodeName, resourceData.phase, resourceData.podIP, resourceData.qosClass, resourceData.reason, resourceData.resize].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.conditions, resourceData.containerStatuses, resourceData.ephemeralContainerStatuses, resourceData.hostIPs, resourceData.initContainerStatuses, resourceData.podIPs, resourceData.resourceClaimStatuses].some(v => v !== undefined && v !== null));
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
                    { label: "Host IP", value: resourceData.hostIP || '-' },
                    { label: "Message", value: resourceData.message || '-' },
                    { label: "Nominated Node Name", value: resourceData.nominatedNodeName || '-' },
                    { label: "Phase", value: resourceData.phase || '-' },
                    { label: "Pod IP", value: resourceData.podIP || '-' },
                    { label: "Qos Class", value: resourceData.qosClass || '-' },
                    { label: "Reason", value: resourceData.reason || '-' },
                    { label: "Resize", value: resourceData.resize || '-' }
                ]}
                columns={1}
            />

            {resourceData.conditions && (
                <ConditionsTable conditions={ resourceData.conditions } />
            )}

            {resourceData.containerStatuses && (
                <Container title="Container Statuses">
                    {resourceData.containerStatuses.map((item, index) => (
                        <ContainerStatusDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.ephemeralContainerStatuses && (
                <Container title="Ephemeral Container Statuses">
                    {resourceData.ephemeralContainerStatuses.map((item, index) => (
                        <ContainerStatusDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.hostIPs && (
                <Container title="Host IPs">
                    {resourceData.hostIPs.map((item, index) => (
                        <HostIPDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.initContainerStatuses && (
                <Container title="Init Container Statuses">
                    {resourceData.initContainerStatuses.map((item, index) => (
                        <ContainerStatusDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.podIPs && (
                <Container title="Pod IPs">
                    {resourceData.podIPs.map((item, index) => (
                        <PodIPDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.resourceClaimStatuses && (
                <Container title="Resource Claim Statuses">
                    {resourceData.resourceClaimStatuses.map((item, index) => (
                        <PodResourceClaimStatusDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}