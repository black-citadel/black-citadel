import { PanelGrid } from "@components/layout/panel";
import type { V1AzureFilePersistentVolumeSource } from "@kubernetes/client-node";

export const AzureFilePersistentVolumeSourceDetails = ({ resourceData }: { resourceData: V1AzureFilePersistentVolumeSource }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.secretName, resourceData.secretNamespace, resourceData.shareName].some(v => v !== undefined && v !== null));
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
                    { label: "Secret Name", value: resourceData.secretName },
                    { label: "Secret Namespace", value: resourceData.secretNamespace || '-' },
                    { label: "Share Name", value: resourceData.shareName }
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