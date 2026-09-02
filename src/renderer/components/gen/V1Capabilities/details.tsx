import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1Capabilities } from "@kubernetes/client-node";

export const CapabilitiesDetails = ({ resourceData }: { resourceData: V1Capabilities }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.add),
        hasValue(resourceData.drop),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Add", value: resourceData.add, description: "Added capabilities" },
                    { label: "Drop", value: resourceData.drop, description: "Removed capabilities" },
                ]}
            />

        </>
    )
}
