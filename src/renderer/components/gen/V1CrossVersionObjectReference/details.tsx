import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1CrossVersionObjectReference } from "@kubernetes/client-node";

export const CrossVersionObjectReferenceDetails = ({ resourceData }: { resourceData: V1CrossVersionObjectReference }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.name),
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
                    { label: "Name", value: resourceData.name, description: "name is the name of the referent; More info: https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names" },
                    { label: "Api Version", value: resourceData.apiVersion, description: "apiVersion is the API version of the referent" },
                    { label: "Kind", value: resourceData.kind, description: "kind is the kind of the referent; More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds" },
                ]}
            />

        </>
    )
}
