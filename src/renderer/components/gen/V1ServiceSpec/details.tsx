import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1ServiceSpec } from "@kubernetes/client-node";
import { ServicePorts } from "@components/networking/service/service-ports";
import { SessionAffinityConfigDetails } from "../V1SessionAffinityConfig/details";

export const ServiceSpecDetails = ({ resourceData }: { resourceData: V1ServiceSpec }): JSX.Element => {
    const selectorItems = Object.entries(resourceData.selector ?? {}).map(([key, value]) => ({ label: key, value }));

    const hasContent = [
        selectorItems.length > 0,
        hasValue(resourceData.type),
        hasValue(resourceData.clusterIP),
        hasValue(resourceData.clusterIPs),
        hasValue(resourceData.externalIPs),
        hasValue(resourceData.externalName),
        hasValue(resourceData.loadBalancerIP),
        hasValue(resourceData.loadBalancerClass),
        hasValue(resourceData.sessionAffinity),
        hasValue(resourceData.externalTrafficPolicy),
        hasValue(resourceData.internalTrafficPolicy),
        hasValue(resourceData.ipFamilyPolicy),
        hasValue(resourceData.ipFamilies),
        hasValue(resourceData.healthCheckNodePort),
        hasValue(resourceData.loadBalancerSourceRanges),
        hasValue(resourceData.trafficDistribution),
        resourceData.allocateLoadBalancerNodePorts === true,
        resourceData.publishNotReadyAddresses === true,
        hasValue(resourceData.ports),
        hasValue(resourceData.sessionAffinityConfig),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Type", value: resourceData.type, description: "type determines how the Service is exposed." },
                    { label: "Cluster IP", value: resourceData.clusterIP, description: "clusterIP is the IP address of the service and is usually assigned randomly." },
                    { label: "Cluster IPs", value: resourceData.clusterIPs, description: "ClusterIPs is a list of IP addresses assigned to this service, and are usually assigned randomly." },
                    { label: "External IPs", value: resourceData.externalIPs, description: "externalIPs is a list of IP addresses for which nodes in the cluster will also accept traffic for this service." },
                    { label: "External Name", value: resourceData.externalName, description: "externalName is the external reference that discovery mechanisms will return as an alias for this service (e.g." },
                    { label: "Load Balancer IP", value: resourceData.loadBalancerIP, description: "Only applies to Service Type: LoadBalancer." },
                    { label: "Load Balancer Class", value: resourceData.loadBalancerClass, description: "loadBalancerClass is the class of the load balancer implementation this Service belongs to." },
                    { label: "Session Affinity", value: resourceData.sessionAffinity, description: "Supports \"ClientIP\" and \"None\"." },
                    { label: "External Traffic Policy", value: resourceData.externalTrafficPolicy, description: "externalTrafficPolicy describes how nodes distribute service traffic they receive on one of the Service's \"externally-facing\" addresses (NodePorts, ExternalIPs…" },
                    { label: "Internal Traffic Policy", value: resourceData.internalTrafficPolicy, description: "InternalTrafficPolicy describes how nodes distribute service traffic they receive on the ClusterIP." },
                    { label: "Ip Family Policy", value: resourceData.ipFamilyPolicy, description: "IPFamilyPolicy represents the dual-stack-ness requested or required by this Service." },
                    { label: "Ip Families", value: resourceData.ipFamilies, description: "IPFamilies is a list of IP families (e.g." },
                    { label: "Health Check Node Port", value: resourceData.healthCheckNodePort, description: "healthCheckNodePort specifies the healthcheck nodePort for the service." },
                    { label: "Load Balancer Source Ranges", value: resourceData.loadBalancerSourceRanges, description: "If specified and supported by the platform, this will restrict traffic through the cloud-provider load-balancer will be restricted to the specified client IPs." },
                    { label: "Traffic Distribution", value: resourceData.trafficDistribution, description: "TrafficDistribution offers a way to express preferences for how traffic is distributed to Service endpoints." },
                ]}
                flags={[
                    { label: "Allocate Load Balancer Node Ports", value: resourceData.allocateLoadBalancerNodePorts, description: "allocateLoadBalancerNodePorts defines if NodePorts will be automatically allocated for services with type LoadBalancer." },
                    { label: "Publish Not Ready Addresses", value: resourceData.publishNotReadyAddresses, description: "publishNotReadyAddresses indicates that any agent which deals with endpoints for this Service should disregard any indications of ready/not-ready." },
                ]}
            />

            <PanelGrid title="Selector" items={ selectorItems } />

            {hasValue(resourceData.ports) && (
                <Container title="Ports" count={resourceData.ports.length} collapsible defaultOpen={ true }>
                    <ServicePorts ports={resourceData.ports } />
                </Container>
            )}

            {hasValue(resourceData.sessionAffinityConfig) && (
                <Container title="Session Affinity Config" collapsible defaultOpen={ false }>
                    <SessionAffinityConfigDetails resourceData={resourceData.sessionAffinityConfig } />
                </Container>
            )}

        </>
    )
}
