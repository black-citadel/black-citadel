import { PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1NodeSelectorTerm } from "@kubernetes/client-node";
import { NodeSelectorRequirementDetails } from "../V1NodeSelectorRequirement/details";

export const NodeSelectorTermDetails = ({ resourceData }: { resourceData: V1NodeSelectorTerm }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.matchExpressions),
        hasValue(resourceData.matchFields),
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
                            <NodeSelectorRequirementDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

            {hasValue(resourceData.matchFields) && (
                <Container title="Match Fields" count={resourceData.matchFields.length} collapsible defaultOpen={ true }>
                    {resourceData.matchFields.map((item, index) => (
                        <PanelListItem key={index}>
                            <NodeSelectorRequirementDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
