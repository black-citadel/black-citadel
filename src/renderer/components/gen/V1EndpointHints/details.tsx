import { PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1EndpointHints } from "@kubernetes/client-node";
import { ForZoneDetails } from "../V1ForZone/details";

export const EndpointHintsDetails = ({ resourceData }: { resourceData: V1EndpointHints }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.forZones),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.forZones) && (
                <Container title="For Zones" count={resourceData.forZones.length} collapsible defaultOpen={ true }>
                    {resourceData.forZones.map((item, index) => (
                        <PanelListItem key={index} title={item.name }>
                            <ForZoneDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
