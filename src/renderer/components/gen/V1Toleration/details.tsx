import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1Toleration } from "@kubernetes/client-node";

export const TolerationDetails = ({ resourceData }: { resourceData: V1Toleration }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.effect),
        hasValue(resourceData.key),
        hasValue(resourceData.operator),
        hasValue(resourceData.tolerationSeconds),
        hasValue(resourceData.value),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Effect", value: resourceData.effect, description: "Effect indicates the taint effect to match." },
                    { label: "Key", value: resourceData.key, description: "Key is the taint key that the toleration applies to." },
                    { label: "Operator", value: resourceData.operator, description: "Operator represents a key's relationship to the value." },
                    { label: "Toleration Seconds", value: resourceData.tolerationSeconds, description: "TolerationSeconds represents the period of time the toleration (which must be of effect NoExecute, otherwise this field is ignored) tolerates the taint." },
                    { label: "Value", value: resourceData.value, description: "Value is the taint value the toleration matches to." },
                ]}
            />

        </>
    )
}
