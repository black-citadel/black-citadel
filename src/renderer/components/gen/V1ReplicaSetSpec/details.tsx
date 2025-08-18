import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { V1ReplicaSetSpec } from "@utils/k8s-types";
import { LabelSelectorDetails } from "../V1LabelSelector/details";
import { PodTemplateSpecDetails } from "../V1PodTemplateSpec/details";

export const ReplicaSetSpecDetails = ({ resourceData }: { resourceData: V1ReplicaSetSpec }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.minReadySeconds, resourceData.replicas].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.selector, resourceData.template].some(v => v !== undefined && v !== null));
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
                    { label: "Replicas", value: resourceData.replicas || '-' }
                ]}
                columns={1}
            />

            <Container title="Selector">
                <LabelSelectorDetails resourceData={ resourceData.selector } />
            </Container>

            {resourceData.template && (
                <Container title="Template">
                    <PodTemplateSpecDetails resourceData={ resourceData.template } />
                </Container>
            )}

        </>
    )
}