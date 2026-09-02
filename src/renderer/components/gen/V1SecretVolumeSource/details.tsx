import { PanelGrid, PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1SecretVolumeSource } from "@kubernetes/client-node";
import { KeyToPathDetails } from "../V1KeyToPath/details";

export const SecretVolumeSourceDetails = ({ resourceData }: { resourceData: V1SecretVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.defaultMode),
        hasValue(resourceData.secretName),
        resourceData.optional === true,
        hasValue(resourceData.items),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Default Mode", value: resourceData.defaultMode, description: "defaultMode is Optional: mode bits used to set permissions on created files by default." },
                    { label: "Secret Name", value: resourceData.secretName, description: "secretName is the name of the secret in the pod's namespace to use." },
                ]}
                flags={[
                    { label: "Optional", value: resourceData.optional, description: "optional field specify whether the Secret or its keys must be defined" },
                ]}
            />

            {hasValue(resourceData.items) && (
                <Container title="Items" count={resourceData.items.length} collapsible defaultOpen={ true }>
                    {resourceData.items.map((item, index) => (
                        <PanelListItem key={index}>
                            <KeyToPathDetails resourceData={item} />
                        </PanelListItem>
                    ))}
                </Container>
            )}

        </>
    )
}
