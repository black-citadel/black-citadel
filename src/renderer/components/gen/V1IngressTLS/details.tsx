import { PanelGrid } from "@components/layout/panel";
import { V1IngressTLS } from "@utils/k8s-types";

export const IngressTLSDetails = ({ resourceData }: { resourceData: V1IngressTLS }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.secretName].some(v => v !== undefined && v !== null));
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
                    { label: "Secret Name", value: resourceData.secretName || '-' }
                ]}
                columns={1}
            />

        </>
    )
}