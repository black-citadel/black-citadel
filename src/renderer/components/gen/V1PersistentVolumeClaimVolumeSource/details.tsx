import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1PersistentVolumeClaimVolumeSource } from "@kubernetes/client-node";

export const PersistentVolumeClaimVolumeSourceDetails = ({ resourceData }: { resourceData: V1PersistentVolumeClaimVolumeSource }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.claimName),
        resourceData.readOnly === true,
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Claim Name", value: resourceData.claimName, description: "claimName is the name of a PersistentVolumeClaim in the same namespace as the pod using this volume." },
                ]}
                flags={[
                    { label: "Read Only", value: resourceData.readOnly, description: "readOnly Will force the ReadOnly setting in VolumeMounts." },
                ]}
            />

        </>
    )
}
