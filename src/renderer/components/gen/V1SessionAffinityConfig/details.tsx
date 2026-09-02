import { hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1SessionAffinityConfig } from "@kubernetes/client-node";
import { ClientIPConfigDetails } from "../V1ClientIPConfig/details";

export const SessionAffinityConfigDetails = ({ resourceData }: { resourceData: V1SessionAffinityConfig }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.clientIP),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {hasValue(resourceData.clientIP) && (
                <Container title="Client IP" collapsible defaultOpen={ true }>
                    <ClientIPConfigDetails resourceData={resourceData.clientIP } />
                </Container>
            )}

        </>
    )
}
