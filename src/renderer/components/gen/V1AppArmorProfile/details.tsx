import { PanelGrid } from "@components/layout/panel";
import type { V1AppArmorProfile } from "@kubernetes/client-node";

export const AppArmorProfileDetails = ({ resourceData }: { resourceData: V1AppArmorProfile }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks: boolean[] = [];
        // Check simple properties
        checks.push([resourceData.localhostProfile, resourceData.type].some(v => v !== undefined && v !== null));
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
                    { label: "Localhost Profile", value: resourceData.localhostProfile || '-' },
                    { label: "Type", value: resourceData.type }
                ]}
                columns={1}
            />

        </>
    )
}