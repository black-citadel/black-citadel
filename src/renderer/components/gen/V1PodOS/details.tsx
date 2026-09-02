import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1PodOS } from "@kubernetes/client-node";

export const PodOSDetails = ({ resourceData }: { resourceData: V1PodOS }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.name),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Name", value: resourceData.name, description: "Name is the name of the operating system." },
                ]}
            />

        </>
    )
}
