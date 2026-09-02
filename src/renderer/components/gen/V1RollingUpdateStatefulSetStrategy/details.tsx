import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1RollingUpdateStatefulSetStrategy } from "@kubernetes/client-node";

export const RollingUpdateStatefulSetStrategyDetails = ({ resourceData }: { resourceData: V1RollingUpdateStatefulSetStrategy }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.maxUnavailable),
        hasValue(resourceData.partition),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Max Unavailable", value: resourceData.maxUnavailable, description: "IntOrString is a type that can hold an int32 or a string." },
                    { label: "Partition", value: resourceData.partition, description: "Partition indicates the ordinal at which the StatefulSet should be partitioned for updates." },
                ]}
            />

        </>
    )
}
