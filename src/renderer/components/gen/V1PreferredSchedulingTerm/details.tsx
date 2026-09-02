import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1PreferredSchedulingTerm } from "@kubernetes/client-node";
import { NodeSelectorTermDetails } from "../V1NodeSelectorTerm/details";

export const PreferredSchedulingTermDetails = ({ resourceData }: { resourceData: V1PreferredSchedulingTerm }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.weight].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.preference].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="Properties"
                items={[
                    { label: "Weight", value: resourceData.weight }
                ]}
                columns={1}
            />

            <Container title="Preference">
                <NodeSelectorTermDetails resourceData={ resourceData.preference } />
            </Container>

        </>
    )
}