import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1ContainerStateWaiting } from "@kubernetes/client-node";

export const ContainerStateWaitingDetails = ({ resourceData }: { resourceData: V1ContainerStateWaiting }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.message),
        hasValue(resourceData.reason),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Message", value: resourceData.message, description: "Message regarding why the container is not yet running." },
                    { label: "Reason", value: resourceData.reason, description: "(brief) reason the container is not yet running." },
                ]}
            />

        </>
    )
}
