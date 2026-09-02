import { PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1SuccessPolicy } from "@kubernetes/client-node";
import { SuccessPolicyRuleDetails } from "../V1SuccessPolicyRule/details";

export const SuccessPolicyDetails = ({ resourceData }: { resourceData: V1SuccessPolicy }): JSX.Element => {

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
                            <SuccessPolicyRuleDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
