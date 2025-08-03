import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1HTTPIngressRuleValue, V1HTTPIngressPath } from "@utils/k8s-types";
import { HTTPIngressPathDetails } from "../V1HTTPIngressPath/details";

export const HTTPIngressRuleValueDetails = ({ resourceData }: { resourceData: V1HTTPIngressRuleValue }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
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