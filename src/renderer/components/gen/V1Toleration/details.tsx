import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1Toleration } from "@utils/k8s-types";

export const TolerationDetails = ({ resourceData }: { resourceData: V1Toleration }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.effect, resourceData.key, resourceData.operator, resourceData.tolerationSeconds, resourceData.value].some(v => v !== undefined && v !== null));
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
                    { label: "Effect", value: resourceData.effect || '-' },
                    { label: "Key", value: resourceData.key || '-' },
                    { label: "Operator", value: resourceData.operator || '-' },
                    { label: "Toleration Seconds", value: resourceData.tolerationSeconds || '-' },
                    { label: "Value", value: resourceData.value || '-' }
                ]}
                columns={1}
            />

        </>
    )
}