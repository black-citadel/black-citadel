import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1SleepAction } from "@kubernetes/client-node";

export const SleepActionDetails = ({ resourceData }: { resourceData: V1SleepAction }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.seconds),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Seconds", value: resourceData.seconds, description: "Seconds is the number of seconds to sleep." },
                ]}
            />

        </>
    )
}
