import { PanelGrid } from "@components/layout/panel";
import { V1LinuxContainerUser } from "@utils/k8s-types";

export const LinuxContainerUserDetails = ({ resourceData }: { resourceData: V1LinuxContainerUser }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.gid, resourceData.uid].some(v => v !== undefined && v !== null));
        return checks.length > 0 ? checks.some(v => v) : false;
    })();

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                title="Properties"
                items={[
                    { label: "Gid", value: resourceData.gid },
                    { label: "Uid", value: resourceData.uid }
                ]}
                columns={1}
            />

        </>
    )
}