import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { V1DeploymentSpec } from "@utils/k8s-types";
import { LabelSelectorDetails } from "../V1LabelSelector/details";
import { DeploymentStrategyDetails } from "../V1DeploymentStrategy/details";
import { PodTemplateSpecDetails } from "../V1PodTemplateSpec/details";

export const DeploymentSpecDetails = ({ resourceData }: { resourceData: V1DeploymentSpec }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.minReadySeconds, resourceData.progressDeadlineSeconds, resourceData.replicas, resourceData.revisionHistoryLimit].some(v => v !== undefined && v !== null));
        // Boolean properties always have content
        checks.push(true);
        // Check k8s type properties
        checks.push([resourceData.selector, resourceData.strategy, resourceData.template].some(v => v !== undefined && v !== null));
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
                    { label: "Progress Deadline Seconds", value: resourceData.progressDeadlineSeconds || '-' },
                    { label: "Replicas", value: resourceData.replicas || '-' },
                    { label: "Revision History Limit", value: resourceData.revisionHistoryLimit || '-' }
                ]}
                columns={1}
            />

            <PanelGrid
                title="Configuration"
                items={[
                    { label: "Paused", value: resourceData.paused ? "Yes" : "No" }
                ]}
                columns={1}
            />

            <Container title="Selector">
                <LabelSelectorDetails resourceData={ resourceData.selector } />
            </Container>

            {resourceData.strategy && (
                <Container title="Strategy">
                    <DeploymentStrategyDetails resourceData={ resourceData.strategy } />
                </Container>
            )}

            <Container title="Template">
                <PodTemplateSpecDetails resourceData={ resourceData.template } />
            </Container>

        </>
    )
}