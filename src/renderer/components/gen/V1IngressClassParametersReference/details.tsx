import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1IngressClassParametersReference } from "@kubernetes/client-node";

export const IngressClassParametersReferenceDetails = ({ resourceData }: { resourceData: V1IngressClassParametersReference }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.apiGroup),
        hasValue(resourceData.name),
        hasValue(resourceData.namespace),
        hasValue(resourceData.scope),
        hasValue(resourceData.kind),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Api Group", value: resourceData.apiGroup, description: "apiGroup is the group for the resource being referenced." },
                    { label: "Name", value: resourceData.name, description: "name is the name of resource being referenced." },
                    { label: "Namespace", value: resourceData.namespace, description: "namespace is the namespace of the resource being referenced." },
                    { label: "Scope", value: resourceData.scope, description: "scope represents if this refers to a cluster or namespace scoped resource." },
                    { label: "Kind", value: resourceData.kind, description: "kind is the type of resource being referenced." },
                ]}
            />

        </>
    )
}
