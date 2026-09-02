import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1Sysctl } from "@kubernetes/client-node";

export const SysctlDetails = ({ resourceData }: { resourceData: V1Sysctl }): JSX.Element => {

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
                    { label: "Name", value: resourceData.name, description: "Name of a property to set" },
                    { label: "Value", value: resourceData.value, description: "Value of a property to set" },
                ]}
            />

        </>
    )
}
