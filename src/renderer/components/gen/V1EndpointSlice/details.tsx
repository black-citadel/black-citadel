import { PanelGrid, PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import type { V1EndpointSlice } from "@kubernetes/client-node";
import { EndpointDetails } from "../V1Endpoint/details";
import { DiscoveryV1EndpointPortDetails } from "../DiscoveryV1EndpointPort/details";

export const EndpointSliceDetails = ({ resourceData }: { resourceData: V1EndpointSlice }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.addressType),
        hasValue(resourceData.endpoints),
        hasValue(resourceData.ports),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <MetadataDetails metadata={resourceData.metadata} />

            <PanelGrid
                items={[
                    { label: "Address Type", value: resourceData.addressType, description: "addressType specifies the type of address carried by this EndpointSlice." },
                ]}
            />

            {hasValue(resourceData.endpoints) && (
                <Container title="Endpoints" count={resourceData.endpoints.length} collapsible defaultOpen={ true }>
                    {resourceData.endpoints.map((item, index) => (
                        <PanelListItem key={index}>
                            <EndpointDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.ports) && (
                <Container title="Ports" count={resourceData.ports.length} collapsible defaultOpen={ true }>
                    {resourceData.ports.map((item, index) => (
                        <PanelListItem key={index} title={item.name }>
                            <DiscoveryV1EndpointPortDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
