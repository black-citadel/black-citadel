import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1ConfigMapVolumeSource, V1KeyToPath } from "@utils/k8s-types";
import { KeyToPathDetails } from "../V1KeyToPath/details";

export const ConfigMapVolumeSourceDetails = ({ resourceData }: { resourceData: V1ConfigMapVolumeSource }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.defaultMode, resourceData.name].some(v => v !== undefined && v !== null));
        // Boolean properties always have content
        checks.push(true);
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
                    { label: "Default Mode", value: resourceData.defaultMode || '-' },
                    { label: "Name", value: resourceData.name || '-' }
                ]}
                columns={1}
            />

            <PanelGrid
                title="Configuration"
                items={[
                    { label: "Optional", value: resourceData.optional ? "Yes" : "No" }
                ]}
                columns={1}
            />

            {resourceData.items && (
                <Container title="Items">
                    {resourceData.items.map((item, index) => (
                        <KeyToPathDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}