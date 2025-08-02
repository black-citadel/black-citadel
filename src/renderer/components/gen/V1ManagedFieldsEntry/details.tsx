import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1ManagedFieldsEntry } from "@utils/k8s-types";

export const ManagedFieldsEntryDetails = ({ resourceData }: { resourceData: V1ManagedFieldsEntry }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.fieldsType, resourceData.manager, resourceData.operation, resourceData.subresource].some(v => v !== undefined && v !== null));
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
                    { label: "Fields Type", value: resourceData.fieldsType || '-' },
                    { label: "Manager", value: resourceData.manager || '-' },
                    { label: "Operation", value: resourceData.operation || '-' },
                    { label: "Subresource", value: resourceData.subresource || '-' }
                ]}
                columns={1}
            />

        </>
    )
}