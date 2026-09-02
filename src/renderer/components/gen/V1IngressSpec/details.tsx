import { PanelGrid, PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1IngressSpec } from "@kubernetes/client-node";
import { IngressBackendDetails } from "../V1IngressBackend/details";
import { IngressRules } from "@components/networking/ingress/ingress-rules";
import { IngressTLSDetails } from "../V1IngressTLS/details";

export const IngressSpecDetails = ({ resourceData }: { resourceData: V1IngressSpec }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.ingressClassName),
        hasValue(resourceData.defaultBackend),
        hasValue(resourceData.rules),
        hasValue(resourceData.tls),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Ingress Class Name", value: resourceData.ingressClassName, description: "ingressClassName is the name of an IngressClass cluster resource." },
                ]}
            />

            {hasValue(resourceData.defaultBackend) && (
                <Container title="Default Backend" collapsible defaultOpen={ true }>
                    <IngressBackendDetails resourceData={resourceData.defaultBackend } />
                </Container>
            )}

            {hasValue(resourceData.rules) && (
                <Container title="Rules" count={resourceData.rules.length} collapsible defaultOpen={ true }>
                    <IngressRules rules={resourceData.rules } />
                </Container>
            )}

            {hasValue(resourceData.tls) && (
                <Container title="Tls" count={resourceData.tls.length} collapsible defaultOpen={ true }>
                    {resourceData.tls.map((item, index) => (
                        <PanelListItem key={index}>
                            <IngressTLSDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
