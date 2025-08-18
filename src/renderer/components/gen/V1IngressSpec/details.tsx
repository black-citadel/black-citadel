import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { V1IngressSpec } from "@utils/k8s-types";
import { IngressBackendDetails } from "../V1IngressBackend/details";
import { IngressRules } from "@components/networking/ingress/ingress-rules";
import { IngressTLSDetails } from "../V1IngressTLS/details";

export const IngressSpecDetails = ({ resourceData }: { resourceData: V1IngressSpec }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.ingressClassName].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.defaultBackend, resourceData.rules, resourceData.tls].some(v => v !== undefined && v !== null));
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
                    { label: "Ingress Class Name", value: resourceData.ingressClassName || '-' }
                ]}
                columns={1}
            />

            {resourceData.defaultBackend && (
                <Container title="Default Backend">
                    <IngressBackendDetails resourceData={ resourceData.defaultBackend } />
                </Container>
            )}

            {resourceData.rules && (
                <Container title="Rules">
                    <IngressRules rules={ resourceData.rules } />
                </Container>
            )}

            {resourceData.tls && (
                <Container title="Tls">
                    {resourceData.tls.map((item, index) => (
                        <IngressTLSDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}