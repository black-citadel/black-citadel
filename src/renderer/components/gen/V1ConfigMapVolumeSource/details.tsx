import { PanelGrid, PanelListItem, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1ConfigMapVolumeSource } from "@kubernetes/client-node";
import { KeyToPathDetails } from "../V1KeyToPath/details";

export const ConfigMapVolumeSourceDetails = ({ resourceData }: { resourceData: V1ConfigMapVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.defaultMode),
        hasValue(resourceData.name),
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
                    { label: "Default Mode", value: resourceData.defaultMode, description: "defaultMode is optional: mode bits used to set permissions on created files by default." },
                    { label: "Name", value: resourceData.name, description: "Name of the referent." },
                ]}
                flags={[
                    { label: "Optional", value: resourceData.optional, description: "optional specify whether the ConfigMap or its keys must be defined" },
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
