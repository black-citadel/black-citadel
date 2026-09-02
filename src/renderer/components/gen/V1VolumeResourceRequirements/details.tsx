import { PanelGrid } from "@components/layout/panel";
import type { V1VolumeResourceRequirements } from "@kubernetes/client-node";

export const VolumeResourceRequirementsDetails = ({ resourceData }: { resourceData: V1VolumeResourceRequirements }): JSX.Element => {
    const limitsItems = Object.entries(resourceData.limits ?? {}).map(([key, value]) => ({ label: key, value }));
    const requestsItems = Object.entries(resourceData.requests ?? {}).map(([key, value]) => ({ label: key, value }));

    const hasContent = [
        limitsItems.length > 0,
        requestsItems.length > 0,
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid title="Limits" items={ limitsItems } />

            <PanelGrid title="Requests" items={ requestsItems } />

        </>
    )
}
