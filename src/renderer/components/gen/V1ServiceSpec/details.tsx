import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1ServiceSpec, V1SessionAffinityConfig } from "@utils/k8s-types";
import { ServicePorts } from "@components/networking/service/service-ports";
import { SessionAffinityConfigDetails } from "../V1SessionAffinityConfig/details";

export const ServiceSpecDetails = ({ resourceData }: { resourceData: V1ServiceSpec }): JSX.Element => {
    // Transform the Selector object into an array of PanelGridItem objects
    const selectorItems = resourceData.selector
        ? Object.entries(resourceData.selector).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check object properties
        checks.push(selectorItems.length > 0);
        // Check simple properties
        checks.push([resourceData.clusterIP, resourceData.externalName, resourceData.externalTrafficPolicy, resourceData.healthCheckNodePort, resourceData.internalTrafficPolicy, resourceData.ipFamilyPolicy, resourceData.loadBalancerClass, resourceData.loadBalancerIP, resourceData.sessionAffinity, resourceData.trafficDistribution, resourceData.type].some(v => v !== undefined && v !== null));
        // Boolean properties always have content
        checks.push(true);
        // Check k8s type properties
        checks.push([resourceData.ports, resourceData.sessionAffinityConfig].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="Selector"
                items={ selectorItems }
                columns={1}
            />

            <PanelGrid
                title="Properties"
                items={[
                    { label: "Cluster IP", value: resourceData.clusterIP || '-' },
                    { label: "External Name", value: resourceData.externalName || '-' },
                    { label: "External Traffic Policy", value: resourceData.externalTrafficPolicy || '-' },
                    { label: "Health Check Node Port", value: resourceData.healthCheckNodePort || '-' },
                    { label: "Internal Traffic Policy", value: resourceData.internalTrafficPolicy || '-' },
                    { label: "Ip Family Policy", value: resourceData.ipFamilyPolicy || '-' },
                    { label: "Load Balancer Class", value: resourceData.loadBalancerClass || '-' },
                    { label: "Load Balancer IP", value: resourceData.loadBalancerIP || '-' },
                    { label: "Session Affinity", value: resourceData.sessionAffinity || '-' },
                    { label: "Traffic Distribution", value: resourceData.trafficDistribution || '-' },
                    { label: "Type", value: resourceData.type || '-' }
                ]}
                columns={1}
            />

            <PanelGrid
                title="Configuration"
                items={[
                    { label: "Allocate Load Balancer Node Ports", value: resourceData.allocateLoadBalancerNodePorts ? "Yes" : "No" },
                    { label: "Publish Not Ready Addresses", value: resourceData.publishNotReadyAddresses ? "Yes" : "No" }
                ]}
                columns={1}
            />

            {resourceData.ports && (
                <Container title="Ports">
                    <ServicePorts ports={ resourceData.ports } />
                </Container>
            )}

            {resourceData.sessionAffinityConfig && (
                <Container title="Session Affinity Config">
                    <SessionAffinityConfigDetails resourceData={ resourceData.sessionAffinityConfig } />
                </Container>
            )}

        </>
    )
}