import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1IngressRule } from "@kubernetes/client-node";
import { HTTPIngressRuleValueDetails } from "../V1HTTPIngressRuleValue/details";

export const IngressRuleDetails = ({ resourceData }: { resourceData: V1IngressRule }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.host].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.http].some(v => v !== undefined && v !== null));
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
                    { label: "Host", value: resourceData.host || '-' }
                ]}
                columns={1}
            />

            {resourceData.http && (
                <Container title="Http">
                    <HTTPIngressRuleValueDetails resourceData={ resourceData.http } />
                </Container>
            )}

        </>
    )
}