import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1PreferredSchedulingTerm } from "@kubernetes/client-node";
import { NodeSelectorTermDetails } from "../V1NodeSelectorTerm/details";

export const PreferredSchedulingTermDetails = ({ resourceData }: { resourceData: V1PreferredSchedulingTerm }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.weight),
        hasValue(resourceData.preference),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Weight", value: resourceData.weight, description: "Weight associated with matching the corresponding nodeSelectorTerm, in the range 1-100." },
                ]}
            />

            {hasValue(resourceData.preference) && (
                <Container title="Preference" collapsible defaultOpen={ true }>
                    <NodeSelectorTermDetails resourceData={resourceData.preference } />
                </Container>
            )}

        </>
    )
}
