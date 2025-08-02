import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1NodeSelector, V1NodeSelectorTerm } from "@utils/k8s-types";
import { NodeSelectorTermDetails } from "../V1NodeSelectorTerm/details";

export const NodeSelectorDetails = ({ resourceData }: { resourceData: V1NodeSelector }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check k8s type properties
        checks.push([resourceData.nodeSelectorTerms].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.nodeSelectorTerms && (
                <Container title="Node Selector Terms">
                    {resourceData.nodeSelectorTerms.map((item, index) => (
                        <NodeSelectorTermDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}