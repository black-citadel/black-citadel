import { PanelGrid } from "@components/layout/panel";
import { V1ObjectReference } from "@utils/k8s-types";

export const ObjectReferenceDetails = ({ resourceData }: { resourceData: V1ObjectReference }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.fieldPath, resourceData.name, resourceData.namespace, resourceData.resourceVersion, resourceData.uid, resourceData.apiVersion, resourceData.kind].some(v => v !== undefined && v !== null));
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
                    { label: "Field Path", value: resourceData.fieldPath || '-' },
                    { label: "Name", value: resourceData.name || '-' },
                    { label: "Namespace", value: resourceData.namespace || '-' },
                    { label: "Resource Version", value: resourceData.resourceVersion || '-' },
                    { label: "Uid", value: resourceData.uid || '-' },
                    { label: "Api Version", value: resourceData.apiVersion || '-' },
                    { label: "Kind", value: resourceData.kind || '-' }
                ]}
                columns={1}
            />

        </>
    )
}