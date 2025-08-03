import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1EndpointSubset, V1EndpointAddress } from "@utils/k8s-types";
import { EndpointAddressDetails } from "../V1EndpointAddress/details";
import { EndpointPorts } from "@components/networking/endpoints/endpoint-ports";

export const EndpointSubsetDetails = ({ resourceData }: { resourceData: V1EndpointSubset }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check k8s type properties
        checks.push([resourceData.addresses, resourceData.notReadyAddresses, resourceData.ports].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.addresses && (
                <Container title="Addresses">
                    {resourceData.addresses.map((item, index) => (
                        <EndpointAddressDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.notReadyAddresses && (
                <Container title="Not Ready Addresses">
                    {resourceData.notReadyAddresses.map((item, index) => (
                        <EndpointAddressDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.ports && (
                <Container title="Ports">
                    <EndpointPorts ports={ resourceData.ports } />
                </Container>
            )}

        </>
    )
}