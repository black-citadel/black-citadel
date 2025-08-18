import { Container } from "@components/base/container";
import { V1ScopeSelector } from "@utils/k8s-types";
import { ScopedResourceSelectorRequirementDetails } from "../V1ScopedResourceSelectorRequirement/details";

export const ScopeSelectorDetails = ({ resourceData }: { resourceData: V1ScopeSelector }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check k8s type properties
        checks.push([resourceData.matchExpressions].some(v => v !== undefined && v !== null));
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
                        <ScopedResourceSelectorRequirementDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}