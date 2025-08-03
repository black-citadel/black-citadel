import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1EndpointConditions } from "@utils/k8s-types";

export const EndpointConditionsDetails = ({ resourceData }: { resourceData: V1EndpointConditions }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
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
                title="Configuration"
                items={[
                    { label: "Ready", value: resourceData.ready ? "Yes" : "No" },
                    { label: "Serving", value: resourceData.serving ? "Yes" : "No" },
                    { label: "Terminating", value: resourceData.terminating ? "Yes" : "No" }
                ]}
                columns={1}
            />

        </>
    )
}