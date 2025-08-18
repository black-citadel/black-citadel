import { PanelGrid } from "@components/layout/panel";
import { V1ContainerStateWaiting } from "@utils/k8s-types";

export const ContainerStateWaitingDetails = ({ resourceData }: { resourceData: V1ContainerStateWaiting }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.message, resourceData.reason].some(v => v !== undefined && v !== null));
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
                    { label: "Message", value: resourceData.message || '-' },
                    { label: "Reason", value: resourceData.reason || '-' }
                ]}
                columns={1}
            />

        </>
    )
}