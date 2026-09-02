import { PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1PodFailurePolicy } from "@kubernetes/client-node";
import { PodFailurePolicyRuleDetails } from "../V1PodFailurePolicyRule/details";

export const PodFailurePolicyDetails = ({ resourceData }: { resourceData: V1PodFailurePolicy }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.rules),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.rules) && (
                <Container title="Rules" count={resourceData.rules.length} collapsible defaultOpen={ true }>
                    {resourceData.rules.map((item, index) => (
                        <PanelListItem key={index}>
                            <PodFailurePolicyRuleDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
