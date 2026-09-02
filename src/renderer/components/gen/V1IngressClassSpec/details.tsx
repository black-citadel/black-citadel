import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1IngressClassSpec } from "@kubernetes/client-node";
import { IngressClassParametersReferenceDetails } from "../V1IngressClassParametersReference/details";

export const IngressClassSpecDetails = ({ resourceData }: { resourceData: V1IngressClassSpec }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.controller].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.parameters].some(v => v !== undefined && v !== null));
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
                    { label: "Controller", value: resourceData.controller || '-' }
                ]}
                columns={1}
            />

            {resourceData.parameters && (
                <Container title="Parameters">
                    <IngressClassParametersReferenceDetails resourceData={ resourceData.parameters } />
                </Container>
            )}

        </>
    )
}