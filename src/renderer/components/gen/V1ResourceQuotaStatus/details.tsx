import { PanelGrid } from "@components/layout/panel";
import type { V1ResourceQuotaStatus } from "@kubernetes/client-node";

export const ResourceQuotaStatusDetails = ({ resourceData }: { resourceData: V1ResourceQuotaStatus }): JSX.Element => {
    const hardItems = Object.entries(resourceData.hard ?? {}).map(([key, value]) => ({ label: key, value }));
    const usedItems = Object.entries(resourceData.used ?? {}).map(([key, value]) => ({ label: key, value }));

    const hasContent = [
        hardItems.length > 0,
        usedItems.length > 0,
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid title="Hard" items={ hardItems } />

            <PanelGrid title="Used" items={ usedItems } />

        </>
    )
}
