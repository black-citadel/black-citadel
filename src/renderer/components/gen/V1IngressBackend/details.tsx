import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1IngressBackend, V1TypedLocalObjectReference, V1IngressServiceBackend } from "@utils/k8s-types";
import { TypedLocalObjectReferenceDetails } from "../V1TypedLocalObjectReference/details";
import { IngressServiceBackendDetails } from "../V1IngressServiceBackend/details";

export const IngressBackendDetails = ({ resourceData }: { resourceData: V1IngressBackend }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check k8s type properties
        checks.push([resourceData.resource, resourceData.service].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.resource && (
                <Container title="Resource">
                    <TypedLocalObjectReferenceDetails resourceData={ resourceData.resource } />
                </Container>
            )}

            {resourceData.service && (
                <Container title="Service">
                    <IngressServiceBackendDetails resourceData={ resourceData.service } />
                </Container>
            )}

        </>
    )
}