import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1ResourceQuotaSpec } from "@kubernetes/client-node";
import { ScopeSelectorDetails } from "../V1ScopeSelector/details";

export const ResourceQuotaSpecDetails = ({ resourceData }: { resourceData: V1ResourceQuotaSpec }): JSX.Element => {
    const hardItems = Object.entries(resourceData.hard ?? {}).map(([key, value]) => ({ label: key, value }));

    const hasContent = [
        hardItems.length > 0,
        hasValue(resourceData.scopes),
        hasValue(resourceData.scopeSelector),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Scopes", value: resourceData.scopes, description: "A collection of filters that must match each object tracked by a quota." },
                ]}
            />

            <PanelGrid title="Hard" items={ hardItems } />

            {hasValue(resourceData.scopeSelector) && (
                <Container title="Scope Selector" collapsible defaultOpen={ true }>
                    <ScopeSelectorDetails resourceData={resourceData.scopeSelector } />
                </Container>
            )}

        </>
    )
}
