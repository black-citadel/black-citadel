import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1ResourceQuotaSpec } from "@kubernetes/client-node";
import { ScopeSelectorDetails } from "../V1ScopeSelector/details";

export const ResourceQuotaSpecDetails = ({ resourceData }: { resourceData: V1ResourceQuotaSpec }): JSX.Element => {
    // Transform the Hard object into an array of PanelGridItem objects
    const hardItems = resourceData.hard
        ? Object.entries(resourceData.hard).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check object properties
        checks.push(hardItems.length > 0);
        // Check k8s type properties
        checks.push([resourceData.scopeSelector].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="Hard"
                items={ hardItems }
                columns={1}
            />

            {resourceData.scopeSelector && (
                <Container title="Scope Selector">
                    <ScopeSelectorDetails resourceData={ resourceData.scopeSelector } />
                </Container>
            )}

        </>
    )
}