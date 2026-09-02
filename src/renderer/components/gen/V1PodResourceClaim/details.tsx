import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1PodResourceClaim } from "@kubernetes/client-node";
import { ClaimSourceDetails } from "../V1ClaimSource/details";

export const PodResourceClaimDetails = ({ resourceData }: { resourceData: V1PodResourceClaim }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.name),
        hasValue(resourceData.source),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Name", value: resourceData.name, description: "Name uniquely identifies this resource claim inside the pod." },
                ]}
            />

            {hasValue(resourceData.source) && (
                <Container title="Source" collapsible defaultOpen={ true }>
                    <ClaimSourceDetails resourceData={resourceData.source } />
                </Container>
            )}

        </>
    )
}
