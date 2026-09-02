import { Container } from "@components/base/container";
import type { V1SessionAffinityConfig } from "@kubernetes/client-node";
import { ClientIPConfigDetails } from "../V1ClientIPConfig/details";

export const SessionAffinityConfigDetails = ({ resourceData }: { resourceData: V1SessionAffinityConfig }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check k8s type properties
        checks.push([resourceData.clientIP].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            {resourceData.clientIP && (
                <Container title="Client IP">
                    <ClientIPConfigDetails resourceData={ resourceData.clientIP } />
                </Container>
            )}

        </>
    )
}