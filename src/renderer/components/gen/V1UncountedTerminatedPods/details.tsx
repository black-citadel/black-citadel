import { V1UncountedTerminatedPods } from "@utils/k8s-types";

export const UncountedTerminatedPodsDetails = ({ resourceData: _resourceData }: { resourceData: V1UncountedTerminatedPods }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
        </>
    )
}