import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1ObjectReference } from "@kubernetes/client-node";

export const ObjectReferenceDetails = ({ resourceData }: { resourceData: V1ObjectReference }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.fieldPath),
        hasValue(resourceData.name),
        hasValue(resourceData.namespace),
        hasValue(resourceData.resourceVersion),
        hasValue(resourceData.uid),
        hasValue(resourceData.apiVersion),
        hasValue(resourceData.kind),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Field Path", value: resourceData.fieldPath, description: "If referring to a piece of an object instead of an entire object, this string should contain a valid JSON/Go field access statement, such as desiredState.manif…" },
                    { label: "Name", value: resourceData.name, description: "Name of the referent." },
                    { label: "Namespace", value: resourceData.namespace, description: "Namespace of the referent." },
                    { label: "Resource Version", value: resourceData.resourceVersion, description: "Specific resourceVersion to which this reference is made, if any." },
                    { label: "Uid", value: resourceData.uid, description: "UID of the referent." },
                    { label: "Api Version", value: resourceData.apiVersion, description: "API version of the referent." },
                    { label: "Kind", value: resourceData.kind, description: "Kind of the referent." },
                ]}
            />

        </>
    )
}
