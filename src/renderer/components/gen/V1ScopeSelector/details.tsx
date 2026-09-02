import { PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1ScopeSelector } from "@kubernetes/client-node";
import { ScopedResourceSelectorRequirementDetails } from "../V1ScopedResourceSelectorRequirement/details";

export const ScopeSelectorDetails = ({ resourceData }: { resourceData: V1ScopeSelector }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.matchExpressions),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.matchExpressions) && (
                <Container title="Match Expressions" count={resourceData.matchExpressions.length} collapsible defaultOpen={ true }>
                    {resourceData.matchExpressions.map((item, index) => (
                        <PanelListItem key={index}>
                            <ScopedResourceSelectorRequirementDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
