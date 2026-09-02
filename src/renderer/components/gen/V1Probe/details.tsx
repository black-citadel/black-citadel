import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1Probe } from "@kubernetes/client-node";
import { HTTPGetActionDetails } from "../V1HTTPGetAction/details";
import { TCPSocketActionDetails } from "../V1TCPSocketAction/details";
import { ExecActionDetails } from "../V1ExecAction/details";
import { GRPCActionDetails } from "../V1GRPCAction/details";

export const ProbeDetails = ({ resourceData }: { resourceData: V1Probe }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.initialDelaySeconds),
        hasValue(resourceData.periodSeconds),
        hasValue(resourceData.timeoutSeconds),
        hasValue(resourceData.successThreshold),
        hasValue(resourceData.failureThreshold),
        hasValue(resourceData.terminationGracePeriodSeconds),
        hasValue(resourceData.httpGet),
        hasValue(resourceData.tcpSocket),
        hasValue(resourceData.exec),
        hasValue(resourceData.grpc),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Initial Delay Seconds", value: resourceData.initialDelaySeconds, description: "Number of seconds after the container has started before liveness probes are initiated." },
                    { label: "Period Seconds", value: resourceData.periodSeconds, description: "How often (in seconds) to perform the probe." },
                    { label: "Timeout Seconds", value: resourceData.timeoutSeconds, description: "Number of seconds after which the probe times out." },
                    { label: "Success Threshold", value: resourceData.successThreshold, description: "Minimum consecutive successes for the probe to be considered successful after having failed." },
                    { label: "Failure Threshold", value: resourceData.failureThreshold, description: "Minimum consecutive failures for the probe to be considered failed after having succeeded." },
                    { label: "Termination Grace Period Seconds", value: resourceData.terminationGracePeriodSeconds, description: "Optional duration in seconds the pod needs to terminate gracefully upon probe failure." },
                ]}
            />

            {hasValue(resourceData.httpGet) && (
                <Container title="Http Get" collapsible defaultOpen={ true }>
                    <HTTPGetActionDetails resourceData={resourceData.httpGet } />
                </Container>
            )}

            {hasValue(resourceData.tcpSocket) && (
                <Container title="Tcp Socket" collapsible defaultOpen={ true }>
                    <TCPSocketActionDetails resourceData={resourceData.tcpSocket } />
                </Container>
            )}

            {hasValue(resourceData.exec) && (
                <Container title="Exec" collapsible defaultOpen={ true }>
                    <ExecActionDetails resourceData={resourceData.exec } />
                </Container>
            )}

            {hasValue(resourceData.grpc) && (
                <Container title="Grpc" collapsible defaultOpen={ true }>
                    <GRPCActionDetails resourceData={resourceData.grpc } />
                </Container>
            )}

        </>
    )
}
