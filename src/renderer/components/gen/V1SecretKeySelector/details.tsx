import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1SecretKeySelector } from "@utils/k8s-types";

export const SecretKeySelectorDetails = ({ resourceData }: { resourceData: V1SecretKeySelector }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.key, resourceData.name].some(v => v !== undefined && v !== null));
        // Boolean properties always have content
        checks.push(true);
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

        </>
    )
}