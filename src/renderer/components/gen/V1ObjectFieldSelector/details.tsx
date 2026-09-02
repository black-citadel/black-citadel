import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1ObjectFieldSelector } from "@kubernetes/client-node";

export const ObjectFieldSelectorDetails = ({ resourceData }: { resourceData: V1ObjectFieldSelector }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.fieldPath),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Field Path", value: resourceData.fieldPath, description: "Path of the field to select in the specified API version." },
                ]}
            />

        </>
    )
}
