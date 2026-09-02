import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1EnvVar } from "@kubernetes/client-node";
import { EnvVarSourceDetails } from "../V1EnvVarSource/details";

export const EnvVarDetails = ({ resourceData }: { resourceData: V1EnvVar }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.name),
        hasValue(resourceData.value),
        hasValue(resourceData.valueFrom),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Name", value: resourceData.name, description: "Name of the environment variable." },
                    { label: "Value", value: resourceData.value, description: "Variable references $(VAR_NAME) are expanded using the previously defined environment variables in the container and any service environment variables." },
                ]}
            />

            {hasValue(resourceData.valueFrom) && (
                <Container title="Value From" collapsible defaultOpen={ true }>
                    <EnvVarSourceDetails resourceData={resourceData.valueFrom } />
                </Container>
            )}

        </>
    )
}
