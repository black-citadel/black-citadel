import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1ResourceFieldSelector } from "@kubernetes/client-node";

export const ResourceFieldSelectorDetails = ({ resourceData }: { resourceData: V1ResourceFieldSelector }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.containerName),
        hasValue(resourceData.divisor),
        hasValue(resourceData.resource),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Container Name", value: resourceData.containerName, description: "Container name: required for volumes, optional for env vars" },
                    { label: "Divisor", value: resourceData.divisor, description: "Specifies the output format of the exposed resources, defaults to \"1\"" },
                    { label: "Resource", value: resourceData.resource, description: "Required: resource to select" },
                ]}
            />

        </>
    )
}
