import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1Endpoint } from "@kubernetes/client-node";
import { EndpointConditionsDetails } from "../V1EndpointConditions/details";
import { EndpointHintsDetails } from "../V1EndpointHints/details";
import { ObjectReferenceDetails } from "../V1ObjectReference/details";

export const EndpointDetails = ({ resourceData }: { resourceData: V1Endpoint }): JSX.Element => {
    const deprecatedTopologyItems = Object.entries(resourceData.deprecatedTopology ?? {}).map(([key, value]) => ({ label: key, value }));

    const hasContent = [
        deprecatedTopologyItems.length > 0,
        hasValue(resourceData.addresses),
        hasValue(resourceData.hostname),
        hasValue(resourceData.nodeName),
        hasValue(resourceData.zone),
        hasValue(resourceData.conditions),
        hasValue(resourceData.hints),
        hasValue(resourceData.targetRef),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Addresses", value: resourceData.addresses, description: "addresses of this endpoint." },
                    { label: "Hostname", value: resourceData.hostname, description: "hostname of this endpoint." },
                    { label: "Node Name", value: resourceData.nodeName, description: "nodeName represents the name of the Node hosting this endpoint." },
                    { label: "Zone", value: resourceData.zone, description: "zone is the name of the Zone this endpoint exists in." },
                ]}
            />

            <PanelGrid title="Deprecated Topology" items={ deprecatedTopologyItems } />

            {hasValue(resourceData.conditions) && (
                <Container title="Conditions" collapsible defaultOpen={ true }>
                    <EndpointConditionsDetails resourceData={resourceData.conditions } />
                </Container>
            )}

            {hasValue(resourceData.hints) && (
                <Container title="Hints" collapsible defaultOpen={ true }>
                    <EndpointHintsDetails resourceData={resourceData.hints } />
                </Container>
            )}

            {hasValue(resourceData.targetRef) && (
                <Container title="Target Ref" collapsible defaultOpen={ true }>
                    <ObjectReferenceDetails resourceData={resourceData.targetRef } />
                </Container>
            )}

        </>
    )
}
