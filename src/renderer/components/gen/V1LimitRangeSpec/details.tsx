import { PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1LimitRangeSpec } from "@kubernetes/client-node";
import { LimitRangeItemDetails } from "../V1LimitRangeItem/details";

export const LimitRangeSpecDetails = ({ resourceData }: { resourceData: V1LimitRangeSpec }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.limits),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.limits) && (
                <Container title="Limits" count={resourceData.limits.length} collapsible defaultOpen={ true }>
                    {resourceData.limits.map((item, index) => (
                        <PanelListItem key={index}>
                            <LimitRangeItemDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
