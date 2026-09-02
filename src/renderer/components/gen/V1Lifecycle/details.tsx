import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1Lifecycle } from "@kubernetes/client-node";
import { LifecycleHandlerDetails } from "../V1LifecycleHandler/details";

export const LifecycleDetails = ({ resourceData }: { resourceData: V1Lifecycle }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.postStart),
        hasValue(resourceData.preStop),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.postStart) && (
                <Container title="Post Start" collapsible defaultOpen={ true }>
                    <LifecycleHandlerDetails resourceData={resourceData.postStart } />
                </Container>
            )}

            {hasValue(resourceData.preStop) && (
                <Container title="Pre Stop" collapsible defaultOpen={ true }>
                    <LifecycleHandlerDetails resourceData={resourceData.preStop } />
                </Container>
            )}

        </>
    )
}
