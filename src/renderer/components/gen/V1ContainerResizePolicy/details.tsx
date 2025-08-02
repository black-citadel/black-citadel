import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1ContainerResizePolicy } from "@utils/k8s-types";

export const ContainerResizePolicyDetails = ({ resourceData }: { resourceData: V1ContainerResizePolicy }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.resourceName, resourceData.restartPolicy].some(v => v !== undefined && v !== null));
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
                    { label: "Resource Name", value: resourceData.resourceName },
                    { label: "Restart Policy", value: resourceData.restartPolicy }
                ]}
                columns={1}
            />

        </>
    )
}