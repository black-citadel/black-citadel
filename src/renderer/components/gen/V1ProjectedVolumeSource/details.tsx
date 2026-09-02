import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1ProjectedVolumeSource } from "@kubernetes/client-node";
import { VolumeProjectionDetails } from "../V1VolumeProjection/details";

export const ProjectedVolumeSourceDetails = ({ resourceData }: { resourceData: V1ProjectedVolumeSource }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.defaultMode].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.sources].some(v => v !== undefined && v !== null));
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
                    { label: "Default Mode", value: resourceData.defaultMode || '-' }
                ]}
                columns={1}
            />

            {resourceData.sources && (
                <Container title="Sources">
                    {resourceData.sources.map((item, index) => (
                        <VolumeProjectionDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}