import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1LabelSelectorRequirement } from "@utils/k8s-types";

export const LabelSelectorRequirementDetails = ({ resourceData }: { resourceData: V1LabelSelectorRequirement }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.key, resourceData.operator].some(v => v !== undefined && v !== null));
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
                    { label: "Key", value: resourceData.key },
                    { label: "Operator", value: resourceData.operator }
                ]}
                columns={1}
            />

        </>
    )
}