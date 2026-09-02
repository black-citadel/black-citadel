import { PanelGrid, PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1ProjectedVolumeSource } from "@kubernetes/client-node";
import { VolumeProjectionDetails } from "../V1VolumeProjection/details";

export const ProjectedVolumeSourceDetails = ({ resourceData }: { resourceData: V1ProjectedVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.defaultMode),
        hasValue(resourceData.sources),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Default Mode", value: resourceData.defaultMode, description: "defaultMode are the mode bits used to set permissions on created files by default." },
                ]}
            />

            {hasValue(resourceData.sources) && (
                <Container title="Sources" count={resourceData.sources.length} collapsible defaultOpen={ true }>
                    {resourceData.sources.map((item, index) => (
                        <PanelListItem key={index}>
                            <VolumeProjectionDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
