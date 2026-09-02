import { PanelGrid } from "@components/layout/panel";
import type { V1SleepAction } from "@kubernetes/client-node";

export const SleepActionDetails = ({ resourceData }: { resourceData: V1SleepAction }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.seconds].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="Properties"
                items={[
                    { label: "Seconds", value: resourceData.seconds }
                ]}
                columns={1}
            />

        </>
    )
}