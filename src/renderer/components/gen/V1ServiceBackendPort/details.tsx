import { PanelGrid } from "@components/layout/panel";
import { V1ServiceBackendPort } from "@utils/k8s-types";

export const ServiceBackendPortDetails = ({ resourceData }: { resourceData: V1ServiceBackendPort }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.name, resourceData.number].some(v => v !== undefined && v !== null));
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
                    { label: "Name", value: resourceData.name || '-' },
                    { label: "Number", value: resourceData.number || '-' }
                ]}
                columns={1}
            />

        </>
    )
}