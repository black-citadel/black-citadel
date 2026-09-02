import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1StatefulSetOrdinals } from "@kubernetes/client-node";

export const StatefulSetOrdinalsDetails = ({ resourceData }: { resourceData: V1StatefulSetOrdinals }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.start),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Start", value: resourceData.start, description: "start is the number representing the first replica's index." },
                ]}
            />

        </>
    )
}
