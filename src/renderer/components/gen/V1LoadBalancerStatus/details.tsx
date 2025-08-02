import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1LoadBalancerStatus, V1LoadBalancerIngress } from "@utils/k8s-types";
import { LoadBalancerIngressDetails } from "../V1LoadBalancerIngress/details";

export const LoadBalancerStatusDetails = ({ resourceData }: { resourceData: V1LoadBalancerStatus }): JSX.Element => {

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
                        <LoadBalancerIngressDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}