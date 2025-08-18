import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { V1LoadBalancerIngress } from "@utils/k8s-types";
import { PortStatusDetails } from "../V1PortStatus/details";

export const LoadBalancerIngressDetails = ({ resourceData }: { resourceData: V1LoadBalancerIngress }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.hostname, resourceData.ip, resourceData.ipMode].some(v => v !== undefined && v !== null));
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
                    { label: "Ip", value: resourceData.ip || '-' },
                    { label: "Ip Mode", value: resourceData.ipMode || '-' }
                ]}
                columns={1}
            />

            {resourceData.ports && (
                <Container title="Ports">
                    {resourceData.ports.map((item, index) => (
                        <PortStatusDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}