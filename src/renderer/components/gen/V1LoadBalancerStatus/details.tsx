import { PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1LoadBalancerStatus } from "@kubernetes/client-node";
import { LoadBalancerIngressDetails } from "../V1LoadBalancerIngress/details";

export const LoadBalancerStatusDetails = ({ resourceData }: { resourceData: V1LoadBalancerStatus }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.ingress),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.ingress) && (
                <Container title="Ingress" count={resourceData.ingress.length} collapsible defaultOpen={ true }>
                    {resourceData.ingress.map((item, index) => (
                        <PanelListItem key={index}>
                            <LoadBalancerIngressDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
