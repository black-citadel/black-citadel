import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1PodSchedulingGate } from "@kubernetes/client-node";

export const PodSchedulingGateDetails = ({ resourceData }: { resourceData: V1PodSchedulingGate }): JSX.Element => {

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
                    { label: "Name", value: resourceData.name, description: "Name of the scheduling gate." },
                ]}
            />

        </>
    )
}
