import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1LimitRangeItem } from "@kubernetes/client-node";

export const LimitRangeItemDetails = ({ resourceData }: { resourceData: V1LimitRangeItem }): JSX.Element => {
    const _defaultItems = Object.entries(resourceData._default ?? {}).map(([key, value]) => ({ label: key, value }));
    const defaultRequestItems = Object.entries(resourceData.defaultRequest ?? {}).map(([key, value]) => ({ label: key, value }));
    const maxItems = Object.entries(resourceData.max ?? {}).map(([key, value]) => ({ label: key, value }));
    const maxLimitRequestRatioItems = Object.entries(resourceData.maxLimitRequestRatio ?? {}).map(([key, value]) => ({ label: key, value }));
    const minItems = Object.entries(resourceData.min ?? {}).map(([key, value]) => ({ label: key, value }));

    const hasContent = [
        _defaultItems.length > 0,
        defaultRequestItems.length > 0,
        maxItems.length > 0,
        maxLimitRequestRatioItems.length > 0,
        minItems.length > 0,
        hasValue(resourceData.type),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Type", value: resourceData.type, description: "Type of resource that this limit applies to." },
                ]}
            />

            <PanelGrid title="_default" items={ _defaultItems } />

            <PanelGrid title="Default Request" items={ defaultRequestItems } />

            <PanelGrid title="Max" items={ maxItems } />

            <PanelGrid title="Max Limit Request Ratio" items={ maxLimitRequestRatioItems } />

            <PanelGrid title="Min" items={ minItems } />

        </>
    )
}
