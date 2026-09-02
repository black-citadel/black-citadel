import { PanelGrid, hasValue } from "@components/layout/panel";
import type { V1AppArmorProfile } from "@kubernetes/client-node";

export const AppArmorProfileDetails = ({ resourceData }: { resourceData: V1AppArmorProfile }): JSX.Element => {

    const hasContent = [
        hasValue(resourceData.localhostProfile),
        hasValue(resourceData.type),
    ].some(Boolean);

    if (!hasContent) {
        return <div className="italic text-neutral-400 text-sm">No data</div>;
    }

    return (
        <>
            <PanelGrid
                items={[
                    { label: "Localhost Profile", value: resourceData.localhostProfile, description: "localhostProfile indicates a profile loaded on the node that should be used." },
                    { label: "Type", value: resourceData.type, description: "type indicates which kind of AppArmor profile will be applied." },
                ]}
            />

        </>
    )
}
