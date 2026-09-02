import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1EnvVar } from "@kubernetes/client-node";
import { EnvVarSourceDetails } from "../V1EnvVarSource/details";

export const EnvVarDetails = ({ resourceData }: { resourceData: V1EnvVar }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.name, resourceData.value].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.valueFrom].some(v => v !== undefined && v !== null));
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
                    { label: "Name", value: resourceData.name },
                    { label: "Value", value: resourceData.value || '-' }
                ]}
                columns={1}
            />

            {resourceData.valueFrom && (
                <Container title="Value From">
                    <EnvVarSourceDetails resourceData={ resourceData.valueFrom } />
                </Container>
            )}

        </>
    )
}