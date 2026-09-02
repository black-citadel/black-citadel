import { Container } from "@components/base/container";
import type { V1NodeSelectorTerm } from "@kubernetes/client-node";
import { NodeSelectorRequirementDetails } from "../V1NodeSelectorRequirement/details";

export const NodeSelectorTermDetails = ({ resourceData }: { resourceData: V1NodeSelectorTerm }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check k8s type properties
        checks.push([resourceData.matchExpressions, resourceData.matchFields].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.matchExpressions && (
                <Container title="Match Expressions">
                    {resourceData.matchExpressions.map((item, index) => (
                        <NodeSelectorRequirementDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

            {resourceData.matchFields && (
                <Container title="Match Fields">
                    {resourceData.matchFields.map((item, index) => (
                        <NodeSelectorRequirementDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}