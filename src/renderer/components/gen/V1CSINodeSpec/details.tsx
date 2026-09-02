import { PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1CSINodeSpec } from "@kubernetes/client-node";
import { CSINodeDriverDetails } from "../V1CSINodeDriver/details";

export const CSINodeSpecDetails = ({ resourceData }: { resourceData: V1CSINodeSpec }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.drivers),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.drivers) && (
                <Container title="Drivers" count={resourceData.drivers.length} collapsible defaultOpen={ true }>
                    {resourceData.drivers.map((item, index) => (
                        <PanelListItem key={index} title={item.name }>
                            <CSINodeDriverDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
