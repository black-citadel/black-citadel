import { PanelGrid } from "@components/layout/panel";
import { V1ConfigMapEnvSource } from "@utils/k8s-types";

export const ConfigMapEnvSourceDetails = ({ resourceData }: { resourceData: V1ConfigMapEnvSource }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.name].some(v => v !== undefined && v !== null));
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