import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1CSINodeDriver } from "@kubernetes/client-node";
import { VolumeNodeResourcesDetails } from "../V1VolumeNodeResources/details";

export const CSINodeDriverDetails = ({ resourceData }: { resourceData: V1CSINodeDriver }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.name),
        hasValue(resourceData.nodeID),
        hasValue(resourceData.topologyKeys),
        hasValue(resourceData.allocatable),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Name", value: resourceData.name, description: "name represents the name of the CSI driver that this object refers to." },
                    { label: "Node ID", value: resourceData.nodeID, description: "nodeID of the node from the driver point of view." },
                    { label: "Topology Keys", value: resourceData.topologyKeys, description: "topologyKeys is the list of keys supported by the driver." },
                ]}
            />

            {hasValue(resourceData.allocatable) && (
                <Container title="Allocatable" collapsible defaultOpen={ true }>
                    <VolumeNodeResourcesDetails resourceData={resourceData.allocatable } />
                </Container>
            )}

        </>
    )
}
