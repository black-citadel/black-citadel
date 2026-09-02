import { PanelGrid, PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1LabelSelector } from "@kubernetes/client-node";
import { LabelSelectorRequirementDetails } from "../V1LabelSelectorRequirement/details";

export const LabelSelectorDetails = ({ resourceData }: { resourceData: V1LabelSelector }): JSX.Element => {
    const matchLabelsItems = Object.entries(resourceData.matchLabels ?? {}).map(([key, value]) => ({ label: key, value }));

    const hasContent = [
        matchLabelsItems.length > 0,
        hasValue(resourceData.matchExpressions),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid title="Match Labels" items={ matchLabelsItems } />

            {hasValue(resourceData.matchExpressions) && (
                <Container title="Match Expressions" count={resourceData.matchExpressions.length} collapsible defaultOpen={ true }>
                    {resourceData.matchExpressions.map((item, index) => (
                        <PanelListItem key={index}>
                            <LabelSelectorRequirementDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
