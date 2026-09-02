import { PanelGrid, PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1ResourceRequirements } from "@kubernetes/client-node";
import { ResourceClaimDetails } from "../V1ResourceClaim/details";

export const ResourceRequirementsDetails = ({ resourceData }: { resourceData: V1ResourceRequirements }): JSX.Element => {
    const requestsItems = Object.entries(resourceData.requests ?? {}).map(([key, value]) => ({ label: key, value }));
    const limitsItems = Object.entries(resourceData.limits ?? {}).map(([key, value]) => ({ label: key, value }));

    const hasContent = [
        requestsItems.length > 0,
        limitsItems.length > 0,
        hasValue(resourceData.claims),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid title="Requests" items={ requestsItems } />

            <PanelGrid title="Limits" items={ limitsItems } />

            {hasValue(resourceData.claims) && (
                <Container title="Claims" count={resourceData.claims.length} collapsible defaultOpen={ true }>
                    {resourceData.claims.map((item, index) => (
                        <PanelListItem key={index} title={item.name }>
                            <ResourceClaimDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
