import { PanelGrid, PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1DownwardAPIVolumeSource } from "@kubernetes/client-node";
import { DownwardAPIVolumeFileDetails } from "../V1DownwardAPIVolumeFile/details";

export const DownwardAPIVolumeSourceDetails = ({ resourceData }: { resourceData: V1DownwardAPIVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.defaultMode),
        hasValue(resourceData.items),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Default Mode", value: resourceData.defaultMode, description: "Optional: mode bits to use on created files by default." },
                ]}
            />

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
