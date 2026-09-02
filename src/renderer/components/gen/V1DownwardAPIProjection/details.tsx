import { PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1DownwardAPIProjection } from "@kubernetes/client-node";
import { DownwardAPIVolumeFileDetails } from "../V1DownwardAPIVolumeFile/details";

export const DownwardAPIProjectionDetails = ({ resourceData }: { resourceData: V1DownwardAPIProjection }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.items),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.items) && (
                <Container title="Items" count={resourceData.items.length} collapsible defaultOpen={ true }>
                    {resourceData.items.map((item, index) => (
                        <PanelListItem key={index}>
                            <DownwardAPIVolumeFileDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
