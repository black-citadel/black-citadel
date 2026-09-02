import { PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1NodeSelector } from "@kubernetes/client-node";
import { NodeSelectorTermDetails } from "../V1NodeSelectorTerm/details";

export const NodeSelectorDetails = ({ resourceData }: { resourceData: V1NodeSelector }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.nodeSelectorTerms),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.nodeSelectorTerms) && (
                <Container title="Node Selector Terms" count={resourceData.nodeSelectorTerms.length} collapsible defaultOpen={ true }>
                    {resourceData.nodeSelectorTerms.map((item, index) => (
                        <PanelListItem key={index}>
                            <NodeSelectorTermDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
