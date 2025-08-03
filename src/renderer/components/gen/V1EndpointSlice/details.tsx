import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1EndpointSlice, V1Endpoint } from "@utils/k8s-types";
import { EndpointDetails } from "../V1Endpoint/details";

export const EndpointSliceDetails = ({ resourceData }: { resourceData: V1EndpointSlice }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.addressType].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.endpoints].some(v => v !== undefined && v !== null));
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
                    { label: "Address Type", value: resourceData.addressType }
                ]}
                columns={1}
            />

            {resourceData.endpoints && (
                <Container title="Endpoints">
                    {resourceData.endpoints.map((item, index) => (
                        <EndpointDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            <MetadataDetails metadata={resourceData.metadata} />
        </>
    )
}