import { PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import type { V1Endpoints } from "@kubernetes/client-node";
import { EndpointSubsetDetails } from "../V1EndpointSubset/details";

export const EndpointsDetails = ({ resourceData }: { resourceData: V1Endpoints }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.subsets),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <MetadataDetails metadata={resourceData.metadata} />

            {hasValue(resourceData.subsets) && (
                <Container title="Subsets" count={resourceData.subsets.length} collapsible defaultOpen={ true }>
                    {resourceData.subsets.map((item, index) => (
                        <PanelListItem key={index}>
                            <EndpointSubsetDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
