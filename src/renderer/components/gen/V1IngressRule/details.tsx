import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1IngressRule } from "@kubernetes/client-node";
import { HTTPIngressRuleValueDetails } from "../V1HTTPIngressRuleValue/details";

export const IngressRuleDetails = ({ resourceData }: { resourceData: V1IngressRule }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.host),
        hasValue(resourceData.http),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Host", value: resourceData.host, description: "host is the fully qualified domain name of a network host, as defined by RFC 3986." },
                ]}
            />

            {hasValue(resourceData.http) && (
                <Container title="Http" collapsible defaultOpen={ true }>
                    <HTTPIngressRuleValueDetails resourceData={resourceData.http } />
                </Container>
            )}

        </>
    )
}
