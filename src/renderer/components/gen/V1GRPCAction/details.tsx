import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1GRPCAction } from "@kubernetes/client-node";

export const GRPCActionDetails = ({ resourceData }: { resourceData: V1GRPCAction }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.port),
        hasValue(resourceData.service),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Port", value: resourceData.port, description: "Port number of the gRPC service." },
                    { label: "Service", value: resourceData.service, description: "Service is the name of the service to place in the gRPC HealthCheckRequest (see https://github.com/grpc/grpc/blob/master/doc/health-checking.md)." },
                ]}
            />

        </>
    )
}
