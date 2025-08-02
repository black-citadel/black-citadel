import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1DownwardAPIVolumeSource, V1DownwardAPIVolumeFile } from "@utils/k8s-types";
import { DownwardAPIVolumeFileDetails } from "../V1DownwardAPIVolumeFile/details";

export const DownwardAPIVolumeSourceDetails = ({ resourceData }: { resourceData: V1DownwardAPIVolumeSource }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.defaultMode].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.items].some(v => v !== undefined && v !== null));
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

            {resourceData.items && (
                <Container title="Items">
                    {resourceData.items.map((item, index) => (
                        <DownwardAPIVolumeFileDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}