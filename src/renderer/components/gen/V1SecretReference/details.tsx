import { PanelGrid } from "@components/layout/panel";
import { V1SecretReference } from "@utils/k8s-types";

export const SecretReferenceDetails = ({ resourceData }: { resourceData: V1SecretReference }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.name, resourceData.namespace].some(v => v !== undefined && v !== null));
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
                    { label: "Namespace", value: resourceData.namespace || '-' }
                ]}
                columns={1}
            />

        </>
    )
}