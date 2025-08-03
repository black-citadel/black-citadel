import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1Endpoints, V1EndpointSubset } from "@utils/k8s-types";
import { EndpointSubsetDetails } from "../V1EndpointSubset/details";

export const EndpointsDetails = ({ resourceData }: { resourceData: V1Endpoints }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check k8s type properties
        checks.push([resourceData.subsets].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.subsets && (
                <Container title="Subsets">
                    {resourceData.subsets.map((item, index) => (
                        <EndpointSubsetDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            <MetadataDetails metadata={resourceData.metadata} />
        </>
    )
}