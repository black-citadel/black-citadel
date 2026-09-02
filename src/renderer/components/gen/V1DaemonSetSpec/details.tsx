import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1DaemonSetSpec } from "@kubernetes/client-node";
import { LabelSelectorDetails } from "../V1LabelSelector/details";
import { PodTemplateSpecDetails } from "../V1PodTemplateSpec/details";
import { DaemonSetUpdateStrategyDetails } from "../V1DaemonSetUpdateStrategy/details";

export const DaemonSetSpecDetails = ({ resourceData }: { resourceData: V1DaemonSetSpec }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.minReadySeconds, resourceData.revisionHistoryLimit].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.selector, resourceData.template, resourceData.updateStrategy].some(v => v !== undefined && v !== null));
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
                    { label: "Min Ready Seconds", value: resourceData.minReadySeconds || '-' },
                    { label: "Revision History Limit", value: resourceData.revisionHistoryLimit || '-' }
                ]}
                columns={1}
            />

            <Container title="Selector">
                <LabelSelectorDetails resourceData={ resourceData.selector } />
            </Container>

            <Container title="Template">
                <PodTemplateSpecDetails resourceData={ resourceData.template } />
            </Container>

            {resourceData.updateStrategy && (
                <Container title="Update Strategy">
                    <DaemonSetUpdateStrategyDetails resourceData={ resourceData.updateStrategy } />
                </Container>
            )}

        </>
    )
}