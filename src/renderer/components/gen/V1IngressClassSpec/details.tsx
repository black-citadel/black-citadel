import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1IngressClassSpec } from "@kubernetes/client-node";
import { IngressClassParametersReferenceDetails } from "../V1IngressClassParametersReference/details";

export const IngressClassSpecDetails = ({ resourceData }: { resourceData: V1IngressClassSpec }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.controller),
        hasValue(resourceData.parameters),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Controller", value: resourceData.controller, description: "controller refers to the name of the controller that should handle this class." },
                ]}
            />

            {hasValue(resourceData.parameters) && (
                <Container title="Parameters" collapsible defaultOpen={ true }>
                    <IngressClassParametersReferenceDetails resourceData={resourceData.parameters } />
                </Container>
            )}

        </>
    )
}
