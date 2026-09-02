import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1EndpointAddress } from "@kubernetes/client-node";
import { ObjectReferenceDetails } from "../V1ObjectReference/details";

export const EndpointAddressDetails = ({ resourceData }: { resourceData: V1EndpointAddress }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.hostname),
        hasValue(resourceData.ip),
        hasValue(resourceData.nodeName),
        hasValue(resourceData.targetRef),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Hostname", value: resourceData.hostname, description: "The Hostname of this endpoint" },
                    { label: "Ip", value: resourceData.ip, description: "The IP of this endpoint." },
                    { label: "Node Name", value: resourceData.nodeName, description: "Optional: Node hosting this endpoint." },
                ]}
            />

            {hasValue(resourceData.targetRef) && (
                <Container title="Target Ref" collapsible defaultOpen={ true }>
                    <ObjectReferenceDetails resourceData={resourceData.targetRef } />
                </Container>
            )}

        </>
    )
}
