import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1PodDNSConfigOption } from "@kubernetes/client-node";

export const PodDNSConfigOptionDetails = ({ resourceData }: { resourceData: V1PodDNSConfigOption }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.name),
        hasValue(resourceData.value),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Name", value: resourceData.name, description: "Required." },
                    { label: "Value", value: resourceData.value },
                ]}
            />

        </>
    )
}
