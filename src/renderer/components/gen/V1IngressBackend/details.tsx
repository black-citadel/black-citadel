import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1IngressBackend } from "@kubernetes/client-node";
import { TypedLocalObjectReferenceDetails } from "../V1TypedLocalObjectReference/details";
import { IngressServiceBackendDetails } from "../V1IngressServiceBackend/details";

export const IngressBackendDetails = ({ resourceData }: { resourceData: V1IngressBackend }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.resource),
        hasValue(resourceData.service),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.resource) && (
                <Container title="Resource" collapsible defaultOpen={ true }>
                    <TypedLocalObjectReferenceDetails resourceData={resourceData.resource } />
                </Container>
            )}

            {hasValue(resourceData.service) && (
                <Container title="Service" collapsible defaultOpen={ true }>
                    <IngressServiceBackendDetails resourceData={resourceData.service } />
                </Container>
            )}

        </>
    )
}
