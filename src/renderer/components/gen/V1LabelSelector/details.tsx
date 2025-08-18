import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { V1LabelSelector } from "@utils/k8s-types";
import { LabelSelectorRequirementDetails } from "../V1LabelSelectorRequirement/details";

export const LabelSelectorDetails = ({ resourceData }: { resourceData: V1LabelSelector }): JSX.Element => {
    // Transform the Match Labels object into an array of PanelGridItem objects
    const matchLabelsItems = resourceData.matchLabels
        ? Object.entries(resourceData.matchLabels).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check object properties
        checks.push(matchLabelsItems.length > 0);
        // Check k8s type properties
        checks.push([resourceData.matchExpressions].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="Match Labels"
                items={ matchLabelsItems }
                columns={1}
            />

            {resourceData.matchExpressions && (
                <Container title="Match Expressions">
                    {resourceData.matchExpressions.map((item, index) => (
                        <LabelSelectorRequirementDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}