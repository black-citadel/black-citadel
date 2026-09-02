import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1SecretReference } from "@kubernetes/client-node";

export const SecretReferenceDetails = ({ resourceData }: { resourceData: V1SecretReference }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.name),
        hasValue(resourceData.namespace),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Name", value: resourceData.name, description: "name is unique within a namespace to reference a secret resource." },
                    { label: "Namespace", value: resourceData.namespace, description: "namespace defines the space within which the secret name must be unique." },
                ]}
            />

        </>
    )
}
