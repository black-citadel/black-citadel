import type { V1ContainerStateRunning } from "@kubernetes/client-node";

export const ContainerStateRunningDetails = ({ resourceData }: { resourceData: V1ContainerStateRunning }): JSX.Element => {

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