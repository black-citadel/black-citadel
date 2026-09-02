import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1TypedObjectReference } from "@kubernetes/client-node";

export const TypedObjectReferenceDetails = ({ resourceData }: { resourceData: V1TypedObjectReference }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.apiGroup),
        hasValue(resourceData.name),
        hasValue(resourceData.namespace),
        hasValue(resourceData.kind),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Api Group", value: resourceData.apiGroup, description: "APIGroup is the group for the resource being referenced." },
                    { label: "Name", value: resourceData.name, description: "Name is the name of resource being referenced" },
                    { label: "Namespace", value: resourceData.namespace, description: "Namespace is the namespace of resource being referenced Note that when a namespace is specified, a gateway.networking.k8s.io/ReferenceGrant object is required…" },
                    { label: "Kind", value: resourceData.kind, description: "Kind is the type of resource being referenced" },
                ]}
            />

        </>
    )
}
