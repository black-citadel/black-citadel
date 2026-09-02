import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1SecretKeySelector } from "@kubernetes/client-node";

export const SecretKeySelectorDetails = ({ resourceData }: { resourceData: V1SecretKeySelector }): JSX.Element => {

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
                    { label: "Key", value: resourceData.key, description: "The key of the secret to select from." },
                    { label: "Name", value: resourceData.name, description: "Name of the referent." },
                ]}
                flags={[
                    { label: "Optional", value: resourceData.optional, description: "Specify whether the Secret or its key must be defined" },
                ]}
            />

        </>
    )
}
