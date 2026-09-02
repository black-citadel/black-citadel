import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1ContainerState } from "@kubernetes/client-node";
import { ContainerStateRunningDetails } from "../V1ContainerStateRunning/details";
import { ContainerStateTerminatedDetails } from "../V1ContainerStateTerminated/details";
import { ContainerStateWaitingDetails } from "../V1ContainerStateWaiting/details";

export const ContainerStateDetails = ({ resourceData }: { resourceData: V1ContainerState }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.running),
        hasValue(resourceData.terminated),
        hasValue(resourceData.waiting),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.running) && (
                <Container title="Running" collapsible defaultOpen={ true }>
                    <ContainerStateRunningDetails resourceData={resourceData.running } />
                </Container>
            )}

            {hasValue(resourceData.terminated) && (
                <Container title="Terminated" collapsible defaultOpen={ true }>
                    <ContainerStateTerminatedDetails resourceData={resourceData.terminated } />
                </Container>
            )}

            {hasValue(resourceData.waiting) && (
                <Container title="Waiting" collapsible defaultOpen={ true }>
                    <ContainerStateWaitingDetails resourceData={resourceData.waiting } />
                </Container>
            )}

        </>
    )
}
