import { PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1EndpointSubset } from "@kubernetes/client-node";
import { EndpointAddressDetails } from "../V1EndpointAddress/details";
import { EndpointPorts } from "@components/networking/endpoints/endpoint-ports";

export const EndpointSubsetDetails = ({ resourceData }: { resourceData: V1EndpointSubset }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.addresses),
        hasValue(resourceData.notReadyAddresses),
        hasValue(resourceData.ports),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.addresses) && (
                <Container title="Addresses" count={resourceData.addresses.length} collapsible defaultOpen={ true }>
                    {resourceData.addresses.map((item, index) => (
                        <PanelListItem key={index}>
                            <EndpointAddressDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.notReadyAddresses) && (
                <Container title="Not Ready Addresses" count={resourceData.notReadyAddresses.length} collapsible defaultOpen={ true }>
                    {resourceData.notReadyAddresses.map((item, index) => (
                        <PanelListItem key={index}>
                            <EndpointAddressDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.ports) && (
                <Container title="Ports" count={resourceData.ports.length} collapsible defaultOpen={ true }>
                    <EndpointPorts ports={resourceData.ports } />
                </Container>
            )}

        </>
    )
}
