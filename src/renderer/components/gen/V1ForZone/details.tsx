import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1ForZone } from "@kubernetes/client-node";

export const ForZoneDetails = ({ resourceData }: { resourceData: V1ForZone }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.name),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Name", value: resourceData.name, description: "name represents the name of the zone." },
                ]}
            />

        </>
    )
}
