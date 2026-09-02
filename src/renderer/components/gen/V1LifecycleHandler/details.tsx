import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1LifecycleHandler } from "@kubernetes/client-node";
import { ExecActionDetails } from "../V1ExecAction/details";
import { HTTPGetActionDetails } from "../V1HTTPGetAction/details";
import { SleepActionDetails } from "../V1SleepAction/details";
import { TCPSocketActionDetails } from "../V1TCPSocketAction/details";

export const LifecycleHandlerDetails = ({ resourceData }: { resourceData: V1LifecycleHandler }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.exec),
        hasValue(resourceData.httpGet),
        hasValue(resourceData.sleep),
        hasValue(resourceData.tcpSocket),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.exec) && (
                <Container title="Exec" collapsible defaultOpen={ true }>
                    <ExecActionDetails resourceData={resourceData.exec } />
                </Container>
            )}

            {hasValue(resourceData.httpGet) && (
                <Container title="Http Get" collapsible defaultOpen={ true }>
                    <HTTPGetActionDetails resourceData={resourceData.httpGet } />
                </Container>
            )}

            {hasValue(resourceData.sleep) && (
                <Container title="Sleep" collapsible defaultOpen={ true }>
                    <SleepActionDetails resourceData={resourceData.sleep } />
                </Container>
            )}

            {hasValue(resourceData.tcpSocket) && (
                <Container title="Tcp Socket" collapsible defaultOpen={ true }>
                    <TCPSocketActionDetails resourceData={resourceData.tcpSocket } />
                </Container>
            )}

        </>
    )
}
