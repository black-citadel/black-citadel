import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1ContainerStateRunning } from "@kubernetes/client-node";

export const ContainerStateRunningDetails = ({ resourceData }: { resourceData: V1ContainerStateRunning }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.startedAt),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Started At", value: resourceData.startedAt, description: "Time at which the container was last (re-)started" },
                ]}
            />

        </>
    )
}
