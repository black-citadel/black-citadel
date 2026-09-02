import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1HTTPIngressPath } from "@kubernetes/client-node";
import { IngressBackendDetails } from "../V1IngressBackend/details";

export const HTTPIngressPathDetails = ({ resourceData }: { resourceData: V1HTTPIngressPath }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.path),
        hasValue(resourceData.pathType),
        hasValue(resourceData.backend),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Path", value: resourceData.path, description: "path is matched against the path of an incoming request." },
                    { label: "Path Type", value: resourceData.pathType, description: "pathType determines the interpretation of the path matching." },
                ]}
            />

            {hasValue(resourceData.backend) && (
                <Container title="Backend" collapsible defaultOpen={ true }>
                    <IngressBackendDetails resourceData={resourceData.backend } />
                </Container>
            )}

        </>
    )
}
