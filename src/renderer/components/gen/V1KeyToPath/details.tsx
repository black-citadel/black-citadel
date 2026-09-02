import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1KeyToPath } from "@kubernetes/client-node";

export const KeyToPathDetails = ({ resourceData }: { resourceData: V1KeyToPath }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.key),
        hasValue(resourceData.mode),
        hasValue(resourceData.path),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Key", value: resourceData.key, description: "key is the key to project." },
                    { label: "Mode", value: resourceData.mode, description: "mode is Optional: mode bits used to set permissions on this file." },
                    { label: "Path", value: resourceData.path, description: "path is the relative path of the file to map the key to." },
                ]}
            />

        </>
    )
}
