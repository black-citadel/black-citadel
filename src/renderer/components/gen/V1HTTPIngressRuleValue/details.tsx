import { PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1HTTPIngressRuleValue } from "@kubernetes/client-node";
import { HTTPIngressPathDetails } from "../V1HTTPIngressPath/details";

export const HTTPIngressRuleValueDetails = ({ resourceData }: { resourceData: V1HTTPIngressRuleValue }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.paths),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.paths) && (
                <Container title="Paths" count={resourceData.paths.length} collapsible defaultOpen={ true }>
                    {resourceData.paths.map((item, index) => (
                        <PanelListItem key={index}>
                            <HTTPIngressPathDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
