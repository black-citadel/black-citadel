import { PanelGrid } from "@components/layout/panel";
import { V1VolumeMount } from "@utils/k8s-types";

export const VolumeMountDetails = ({ resourceData }: { resourceData: V1VolumeMount }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.mountPath, resourceData.mountPropagation, resourceData.name, resourceData.recursiveReadOnly, resourceData.subPath, resourceData.subPathExpr].some(v => v !== undefined && v !== null));
        // Boolean properties always have content
        checks.push(true);
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
                    { label: "Mount Path", value: resourceData.mountPath },
                    { label: "Mount Propagation", value: resourceData.mountPropagation || '-' },
                    { label: "Name", value: resourceData.name },
                    { label: "Recursive Read Only", value: resourceData.recursiveReadOnly || '-' },
                    { label: "Sub Path", value: resourceData.subPath || '-' },
                    { label: "Sub Path Expr", value: resourceData.subPathExpr || '-' }
                ]}
                columns={1}
            />

            <PanelGrid
                title="Configuration"
                items={[
                    { label: "Read Only", value: resourceData.readOnly ? "Yes" : "No" }
                ]}
                columns={1}
            />

        </>
    )
}