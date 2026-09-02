import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1HTTPIngressPath } from "@kubernetes/client-node";
import { IngressBackendDetails } from "../V1IngressBackend/details";

export const HTTPIngressPathDetails = ({ resourceData }: { resourceData: V1HTTPIngressPath }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.path, resourceData.pathType].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.backend].some(v => v !== undefined && v !== null));
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
                    { label: "Path", value: resourceData.path || '-' },
                    { label: "Path Type", value: resourceData.pathType }
                ]}
                columns={1}
            />

            <Container title="Backend">
                <IngressBackendDetails resourceData={ resourceData.backend } />
            </Container>

        </>
    )
}