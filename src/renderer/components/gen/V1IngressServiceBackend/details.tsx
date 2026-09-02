import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1IngressServiceBackend } from "@kubernetes/client-node";
import { ServiceBackendPortDetails } from "../V1ServiceBackendPort/details";

export const IngressServiceBackendDetails = ({ resourceData }: { resourceData: V1IngressServiceBackend }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.name),
        hasValue(resourceData.port),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Name", value: resourceData.name, description: "name is the referenced service." },
                ]}
            />

            {hasValue(resourceData.port) && (
                <Container title="Port" collapsible defaultOpen={ true }>
                    <ServiceBackendPortDetails resourceData={resourceData.port } />
                </Container>
            )}

        </>
    )
}
