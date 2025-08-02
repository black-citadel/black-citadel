import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1SeccompProfile } from "@utils/k8s-types";

export const SeccompProfileDetails = ({ resourceData }: { resourceData: V1SeccompProfile }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
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