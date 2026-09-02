import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1RollingUpdateDeployment } from "@kubernetes/client-node";

export const RollingUpdateDeploymentDetails = ({ resourceData }: { resourceData: V1RollingUpdateDeployment }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.maxSurge),
        hasValue(resourceData.maxUnavailable),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Max Surge", value: resourceData.maxSurge, description: "IntOrString is a type that can hold an int32 or a string." },
                    { label: "Max Unavailable", value: resourceData.maxUnavailable, description: "IntOrString is a type that can hold an int32 or a string." },
                ]}
            />

        </>
    )
}
