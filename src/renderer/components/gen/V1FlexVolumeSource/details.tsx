import { PanelGrid, hasValue } from "@components/layout/panel";
import { Container } from "@components/base/container";
import type { V1FlexVolumeSource } from "@kubernetes/client-node";
import { LocalObjectReferenceDetails } from "../V1LocalObjectReference/details";

export const FlexVolumeSourceDetails = ({ resourceData }: { resourceData: V1FlexVolumeSource }): JSX.Element => {
    const optionsItems = Object.entries(resourceData.options ?? {}).map(([key, value]) => ({ label: key, value }));

    const hasContent = [
        optionsItems.length > 0,
        hasValue(resourceData.driver),
        hasValue(resourceData.fsType),
        resourceData.readOnly === true,
        hasValue(resourceData.secretRef),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Driver", value: resourceData.driver, description: "driver is the name of the driver to use for this volume." },
                    { label: "Fs Type", value: resourceData.fsType, description: "fsType is the filesystem type to mount." },
                ]}
                flags={[
                    { label: "Read Only", value: resourceData.readOnly, description: "readOnly is Optional: defaults to false (read/write)." },
                ]}
            />

            <PanelGrid title="Options" items={ optionsItems } />

            {hasValue(resourceData.secretRef) && (
                <Container title="Secret Ref" collapsible defaultOpen={ true }>
                    <LocalObjectReferenceDetails resourceData={resourceData.secretRef } />
                </Container>
            )}

        </>
    )
}
