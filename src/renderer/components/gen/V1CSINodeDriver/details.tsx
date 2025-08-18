import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { V1CSINodeDriver } from "@utils/k8s-types";
import { VolumeNodeResourcesDetails } from "../V1VolumeNodeResources/details";

export const CSINodeDriverDetails = ({ resourceData }: { resourceData: V1CSINodeDriver }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.name, resourceData.nodeID].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.allocatable].some(v => v !== undefined && v !== null));
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
                    { label: "Name", value: resourceData.name },
                    { label: "Node ID", value: resourceData.nodeID }
                ]}
                columns={1}
            />

            {resourceData.allocatable && (
                <Container title="Allocatable">
                    <VolumeNodeResourcesDetails resourceData={ resourceData.allocatable } />
                </Container>
            )}

        </>
    )
}