import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1ManagedFieldsEntry } from "@kubernetes/client-node";

export const ManagedFieldsEntryDetails = ({ resourceData }: { resourceData: V1ManagedFieldsEntry }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.fieldsType),
        hasValue(resourceData.fieldsV1),
        hasValue(resourceData.manager),
        hasValue(resourceData.operation),
        hasValue(resourceData.subresource),
        hasValue(resourceData.time),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Fields Type", value: resourceData.fieldsType, description: "FieldsType is the discriminator for the different fields format and version." },
                    { label: "Fields V1", value: resourceData.fieldsV1, description: "FieldsV1 holds the first JSON version format as described in the \"FieldsV1\" type." },
                    { label: "Manager", value: resourceData.manager, description: "Manager is an identifier of the workflow managing these fields." },
                    { label: "Operation", value: resourceData.operation, description: "Operation is the type of operation which lead to this ManagedFieldsEntry being created." },
                    { label: "Subresource", value: resourceData.subresource, description: "Subresource is the name of the subresource used to update that object, or empty string if the object was updated through the main resource." },
                    { label: "Time", value: resourceData.time, description: "Time is the timestamp of when the ManagedFields entry was added." },
                ]}
            />

        </>
    )
}
