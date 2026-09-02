import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1IngressLoadBalancerIngress } from "@kubernetes/client-node";
import { IngressPortStatusDetails } from "../V1IngressPortStatus/details";

export const IngressLoadBalancerIngressDetails = ({ resourceData }: { resourceData: V1IngressLoadBalancerIngress }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.hostname, resourceData.ip].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.ports].some(v => v !== undefined && v !== null));
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
                    { label: "Hostname", value: resourceData.hostname || '-' },
                    { label: "Ip", value: resourceData.ip || '-' }
                ]}
                columns={1}
            />

            {resourceData.ports && (
                <Container title="Ports">
                    {resourceData.ports.map((item, index) => (
                        <IngressPortStatusDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}