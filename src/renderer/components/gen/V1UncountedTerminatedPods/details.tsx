import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1UncountedTerminatedPods } from "@kubernetes/client-node";

export const UncountedTerminatedPodsDetails = ({ resourceData }: { resourceData: V1UncountedTerminatedPods }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.failed),
        hasValue(resourceData.succeeded),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Failed", value: resourceData.failed, description: "failed holds UIDs of failed Pods." },
                    { label: "Succeeded", value: resourceData.succeeded, description: "succeeded holds UIDs of succeeded Pods." },
                ]}
            />

        </>
    )
}
