import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1ModifyVolumeStatus } from "@kubernetes/client-node";

export const ModifyVolumeStatusDetails = ({ resourceData }: { resourceData: V1ModifyVolumeStatus }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.status),
        hasValue(resourceData.targetVolumeAttributesClassName),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Status", value: resourceData.status, description: "status is the status of the ControllerModifyVolume operation." },
                    { label: "Target Volume Attributes Class Name", value: resourceData.targetVolumeAttributesClassName, description: "targetVolumeAttributesClassName is the name of the VolumeAttributesClass the PVC currently being reconciled" },
                ]}
            />

        </>
    )
}
