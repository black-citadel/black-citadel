import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { V1Endpoint } from "@utils/k8s-types";
import { EndpointConditionsDetails } from "../V1EndpointConditions/details";
import { EndpointHintsDetails } from "../V1EndpointHints/details";
import { ObjectReferenceDetails } from "../V1ObjectReference/details";

export const EndpointDetails = ({ resourceData }: { resourceData: V1Endpoint }): JSX.Element => {
    // Transform the Deprecated Topology object into an array of PanelGridItem objects
    const deprecatedTopologyItems = resourceData.deprecatedTopology
        ? Object.entries(resourceData.deprecatedTopology).map(([key, value]) => ({
            label: key,
            value: value
        }))
        : [];

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check object properties
        checks.push(deprecatedTopologyItems.length > 0);
        // Check simple properties
        checks.push([resourceData.hostname, resourceData.nodeName, resourceData.zone].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.conditions, resourceData.hints, resourceData.targetRef].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="Deprecated Topology"
                items={ deprecatedTopologyItems }
                columns={1}
            />

            <PanelGrid
                title="Properties"
                items={[
                    { label: "Hostname", value: resourceData.hostname || '-' },
                    { label: "Node Name", value: resourceData.nodeName || '-' },
                    { label: "Zone", value: resourceData.zone || '-' }
                ]}
                columns={1}
            />

            {resourceData.conditions && (
                <Container title="Conditions">
                    <EndpointConditionsDetails resourceData={ resourceData.conditions } />
                </Container>
            )}

            {resourceData.hints && (
                <Container title="Hints">
                    <EndpointHintsDetails resourceData={ resourceData.hints } />
                </Container>
            )}

            {resourceData.targetRef && (
                <Container title="Target Ref">
                    <ObjectReferenceDetails resourceData={ resourceData.targetRef } />
                </Container>
            )}

        </>
    )
}