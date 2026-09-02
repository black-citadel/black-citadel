import { Container } from "@components/base/container";
import type { V1LifecycleHandler } from "@kubernetes/client-node";
import { ExecActionDetails } from "../V1ExecAction/details";
import { HTTPGetActionDetails } from "../V1HTTPGetAction/details";
import { SleepActionDetails } from "../V1SleepAction/details";
import { TCPSocketActionDetails } from "../V1TCPSocketAction/details";

export const LifecycleHandlerDetails = ({ resourceData }: { resourceData: V1LifecycleHandler }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check k8s type properties
        checks.push([resourceData.exec, resourceData.httpGet, resourceData.sleep, resourceData.tcpSocket].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.exec && (
                <Container title="Exec">
                    <ExecActionDetails resourceData={ resourceData.exec } />
                </Container>
            )}

            {resourceData.httpGet && (
                <Container title="Http Get">
                    <HTTPGetActionDetails resourceData={ resourceData.httpGet } />
                </Container>
            )}

            {resourceData.sleep && (
                <Container title="Sleep">
                    <SleepActionDetails resourceData={ resourceData.sleep } />
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