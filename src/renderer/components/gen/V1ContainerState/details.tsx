import { Container } from "@components/base/container";
import type { V1ContainerState } from "@kubernetes/client-node";
import { ContainerStateRunningDetails } from "../V1ContainerStateRunning/details";
import { ContainerStateTerminatedDetails } from "../V1ContainerStateTerminated/details";
import { ContainerStateWaitingDetails } from "../V1ContainerStateWaiting/details";

export const ContainerStateDetails = ({ resourceData }: { resourceData: V1ContainerState }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check k8s type properties
        checks.push([resourceData.running, resourceData.terminated, resourceData.waiting].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.running && (
                <Container title="Running">
                    <ContainerStateRunningDetails resourceData={ resourceData.running } />
                </Container>
            )}

            {resourceData.terminated && (
                <Container title="Terminated">
                    <ContainerStateTerminatedDetails resourceData={ resourceData.terminated } />
                </Container>
            )}

            {resourceData.waiting && (
                <Container title="Waiting">
                    <ContainerStateWaitingDetails resourceData={ resourceData.waiting } />
                </Container>
            )}

        </>
    )
}