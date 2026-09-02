import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1HTTPHeader } from "@kubernetes/client-node";

export const HTTPHeaderDetails = ({ resourceData }: { resourceData: V1HTTPHeader }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.name),
        hasValue(resourceData.value),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Name", value: resourceData.name, description: "The header field name." },
                    { label: "Value", value: resourceData.value, description: "The header field value" },
                ]}
            />

        </>
    )
}
