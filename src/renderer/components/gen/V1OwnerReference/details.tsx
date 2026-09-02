import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1OwnerReference } from "@kubernetes/client-node";

export const OwnerReferenceDetails = ({ resourceData }: { resourceData: V1OwnerReference }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.name),
        hasValue(resourceData.uid),
        hasValue(resourceData.apiVersion),
        hasValue(resourceData.kind),
        resourceData.blockOwnerDeletion === true,
        resourceData.controller === true,
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Name", value: resourceData.name, description: "Name of the referent." },
                    { label: "Uid", value: resourceData.uid, description: "UID of the referent." },
                    { label: "Api Version", value: resourceData.apiVersion, description: "API version of the referent." },
                    { label: "Kind", value: resourceData.kind, description: "Kind of the referent." },
                ]}
                flags={[
                    { label: "Block Owner Deletion", value: resourceData.blockOwnerDeletion, description: "If true, AND if the owner has the \"foregroundDeletion\" finalizer, then the owner cannot be deleted from the key-value store until this reference is removed." },
                    { label: "Controller", value: resourceData.controller, description: "If true, this reference points to the managing controller." },
                ]}
            />

        </>
    )
}
