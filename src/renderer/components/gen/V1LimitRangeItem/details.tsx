import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1LimitRangeItem } from "@utils/k8s-types";

export const LimitRangeItemDetails = ({ resourceData }: { resourceData: V1LimitRangeItem }): JSX.Element => {
    // Transform the _default object into an array of PanelGridItem objects
    const _defaultItems = resourceData._default
        ? Object.entries(resourceData._default).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];
    // Transform the Default Request object into an array of PanelGridItem objects
    const defaultRequestItems = resourceData.defaultRequest
        ? Object.entries(resourceData.defaultRequest).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];
    // Transform the Max object into an array of PanelGridItem objects
    const maxItems = resourceData.max
        ? Object.entries(resourceData.max).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];
    // Transform the Max Limit Request Ratio object into an array of PanelGridItem objects
    const maxLimitRequestRatioItems = resourceData.maxLimitRequestRatio
        ? Object.entries(resourceData.maxLimitRequestRatio).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];
    // Transform the Min object into an array of PanelGridItem objects
    const minItems = resourceData.min
        ? Object.entries(resourceData.min).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check object properties
        checks.push(_defaultItems.length > 0 || defaultRequestItems.length > 0 || maxItems.length > 0 || maxLimitRequestRatioItems.length > 0 || minItems.length > 0);
        // Check simple properties
        checks.push([resourceData.type].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="_default"
                items={ _defaultItems }
                columns={1}
            />

            <PanelGrid
                title="Default Request"
                items={ defaultRequestItems }
                columns={1}
            />

            <PanelGrid
                title="Max"
                items={ maxItems }
                columns={1}
            />

            <PanelGrid
                title="Max Limit Request Ratio"
                items={ maxLimitRequestRatioItems }
                columns={1}
            />

            <PanelGrid
                title="Min"
                items={ minItems }
                columns={1}
            />

            <PanelGrid
                title="Properties"
                items={[
                    { label: "Type", value: resourceData.type }
                ]}
                columns={1}
            />

        </>
    )
}