import { PanelGrid } from "@components/layout/panel";
import type { V1EndpointConditions } from "@kubernetes/client-node";

export const EndpointConditionsDetails = ({ resourceData }: { resourceData: V1EndpointConditions }): JSX.Element => {

    const hasContent = [
        resourceData.ready === true,
        resourceData.serving === true,
        resourceData.terminating === true,
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                ]}
                flags={[
                    { label: "Ready", value: resourceData.ready, description: "ready indicates that this endpoint is prepared to receive traffic, according to whatever system is managing the endpoint." },
                    { label: "Serving", value: resourceData.serving, description: "serving is identical to ready except that it is set regardless of the terminating state of endpoints." },
                    { label: "Terminating", value: resourceData.terminating, description: "terminating indicates that this endpoint is terminating." },
                ]}
            />

        </>
    )
}
