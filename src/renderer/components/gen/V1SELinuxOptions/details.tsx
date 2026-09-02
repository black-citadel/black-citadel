import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1SELinuxOptions } from "@kubernetes/client-node";

export const SELinuxOptionsDetails = ({ resourceData }: { resourceData: V1SELinuxOptions }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.level),
        hasValue(resourceData.role),
        hasValue(resourceData.type),
        hasValue(resourceData.user),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Level", value: resourceData.level, description: "Level is SELinux level label that applies to the container." },
                    { label: "Role", value: resourceData.role, description: "Role is a SELinux role label that applies to the container." },
                    { label: "Type", value: resourceData.type, description: "Type is a SELinux type label that applies to the container." },
                    { label: "User", value: resourceData.user, description: "User is a SELinux user label that applies to the container." },
                ]}
            />

        </>
    )
}
