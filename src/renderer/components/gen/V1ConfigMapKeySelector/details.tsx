import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1ConfigMapKeySelector } from "@kubernetes/client-node";

export const ConfigMapKeySelectorDetails = ({ resourceData }: { resourceData: V1ConfigMapKeySelector }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.key),
        hasValue(resourceData.name),
        resourceData.optional === true,
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Key", value: resourceData.key, description: "The key to select." },
                    { label: "Name", value: resourceData.name, description: "Name of the referent." },
                ]}
                flags={[
                    { label: "Optional", value: resourceData.optional, description: "Specify whether the ConfigMap or its key must be defined" },
                ]}
            />

        </>
    )
}
