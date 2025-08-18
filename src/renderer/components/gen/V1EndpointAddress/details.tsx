import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { V1EndpointAddress } from "@utils/k8s-types";
import { ObjectReferenceDetails } from "../V1ObjectReference/details";

export const EndpointAddressDetails = ({ resourceData }: { resourceData: V1EndpointAddress }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.hostname, resourceData.ip, resourceData.nodeName].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.targetRef].some(v => v !== undefined && v !== null));
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
                    { label: "Hostname", value: resourceData.hostname || '-' },
                    { label: "Ip", value: resourceData.ip },
                    { label: "Node Name", value: resourceData.nodeName || '-' }
                ]}
                columns={1}
            />

            {resourceData.targetRef && (
                <Container title="Target Ref">
                    <ObjectReferenceDetails resourceData={ resourceData.targetRef } />
                </Container>
            )}

        </>
    )
}