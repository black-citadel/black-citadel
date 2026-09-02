import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1SecretEnvSource } from "@kubernetes/client-node";

export const SecretEnvSourceDetails = ({ resourceData }: { resourceData: V1SecretEnvSource }): JSX.Element => {

    const hasContent = [
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
                    { label: "Name", value: resourceData.name, description: "Name of the referent." },
                ]}
                flags={[
                    { label: "Optional", value: resourceData.optional, description: "Specify whether the Secret must be defined" },
                ]}
            />

        </>
    )
}
