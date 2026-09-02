import { Container } from "@components/base/container";
import type { V1HTTPIngressRuleValue } from "@kubernetes/client-node";
import { HTTPIngressPathDetails } from "../V1HTTPIngressPath/details";

export const HTTPIngressRuleValueDetails = ({ resourceData }: { resourceData: V1HTTPIngressRuleValue }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check k8s type properties
        checks.push([resourceData.paths].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.paths && (
                <Container title="Paths">
                    {resourceData.paths.map((item, index) => (
                        <HTTPIngressPathDetails key={index} resourceData={item} />
                    ))}
                </Container>
            )}

        </>
    )
}