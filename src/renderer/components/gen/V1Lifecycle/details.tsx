import { Container } from "@components/base/container";
import type { V1Lifecycle } from "@kubernetes/client-node";
import { LifecycleHandlerDetails } from "../V1LifecycleHandler/details";

export const LifecycleDetails = ({ resourceData }: { resourceData: V1Lifecycle }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check k8s type properties
        checks.push([resourceData.postStart, resourceData.preStop].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.postStart && (
                <Container title="Post Start">
                    <LifecycleHandlerDetails resourceData={ resourceData.postStart } />
                </Container>
            )}

            {resourceData.preStop && (
                <Container title="Pre Stop">
                    <LifecycleHandlerDetails resourceData={ resourceData.preStop } />
                </Container>
            )}

        </>
    )
}