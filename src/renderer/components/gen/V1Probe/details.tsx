import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1Probe } from "@kubernetes/client-node";
import { ExecActionDetails } from "../V1ExecAction/details";
import { GRPCActionDetails } from "../V1GRPCAction/details";
import { HTTPGetActionDetails } from "../V1HTTPGetAction/details";
import { TCPSocketActionDetails } from "../V1TCPSocketAction/details";

export const ProbeDetails = ({ resourceData }: { resourceData: V1Probe }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.failureThreshold, resourceData.initialDelaySeconds, resourceData.periodSeconds, resourceData.successThreshold, resourceData.terminationGracePeriodSeconds, resourceData.timeoutSeconds].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.exec, resourceData.grpc, resourceData.httpGet, resourceData.tcpSocket].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="Properties"
                items={[
                    { label: "Failure Threshold", value: resourceData.failureThreshold || '-' },
                    { label: "Initial Delay Seconds", value: resourceData.initialDelaySeconds || '-' },
                    { label: "Period Seconds", value: resourceData.periodSeconds || '-' },
                    { label: "Success Threshold", value: resourceData.successThreshold || '-' },
                    { label: "Termination Grace Period Seconds", value: resourceData.terminationGracePeriodSeconds || '-' },
                    { label: "Timeout Seconds", value: resourceData.timeoutSeconds || '-' }
                ]}
                columns={1}
            />

            {resourceData.exec && (
                <Container title="Exec">
                    <ExecActionDetails resourceData={ resourceData.exec } />
                </Container>
            )}

            {resourceData.grpc && (
                <Container title="Grpc">
                    <GRPCActionDetails resourceData={ resourceData.grpc } />
                </Container>
            )}

            {resourceData.httpGet && (
                <Container title="Http Get">
                    <HTTPGetActionDetails resourceData={ resourceData.httpGet } />
                </Container>
            )}

            {resourceData.tcpSocket && (
                <Container title="Tcp Socket">
                    <TCPSocketActionDetails resourceData={ resourceData.tcpSocket } />
                </Container>
            )}

        </>
    )
}