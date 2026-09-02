import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1PodResourceClaim } from "@kubernetes/client-node";
import { ClaimSourceDetails } from "../V1ClaimSource/details";

export const PodResourceClaimDetails = ({ resourceData }: { resourceData: V1PodResourceClaim }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.name].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.source].some(v => v !== undefined && v !== null));
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
                    { label: "Name", value: resourceData.name }
                ]}
                columns={1}
            />

            {resourceData.source && (
                <Container title="Source">
                    <ClaimSourceDetails resourceData={ resourceData.source } />
                </Container>
            )}

        </>
    )
}