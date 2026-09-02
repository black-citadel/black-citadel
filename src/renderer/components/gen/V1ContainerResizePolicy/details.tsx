import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1ContainerResizePolicy } from "@kubernetes/client-node";

export const ContainerResizePolicyDetails = ({ resourceData }: { resourceData: V1ContainerResizePolicy }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.resourceName),
        hasValue(resourceData.restartPolicy),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Resource Name", value: resourceData.resourceName, description: "Name of the resource to which this resource resize policy applies." },
                    { label: "Restart Policy", value: resourceData.restartPolicy, description: "Restart policy to apply when specified resource is resized." },
                ]}
            />

        </>
    )
}
