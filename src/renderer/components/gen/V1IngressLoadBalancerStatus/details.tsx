import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1IngressLoadBalancerStatus, V1IngressLoadBalancerIngress } from "@utils/k8s-types";
import { IngressLoadBalancerIngressDetails } from "../V1IngressLoadBalancerIngress/details";

export const IngressLoadBalancerStatusDetails = ({ resourceData }: { resourceData: V1IngressLoadBalancerStatus }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check k8s type properties
        checks.push([resourceData.ingress].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.ingress && (
                <Container title="Ingress">
                    {resourceData.ingress.map((item, index) => (
                        <IngressLoadBalancerIngressDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}