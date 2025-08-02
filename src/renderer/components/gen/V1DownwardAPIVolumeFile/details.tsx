import { PanelGrid } from "@components/layout/panel";
import { Container } from "@components/base/container";
import { MetadataDetails } from "@components/metadata";
import { V1DownwardAPIVolumeFile, V1ObjectFieldSelector, V1ResourceFieldSelector } from "@utils/k8s-types";
import { ObjectFieldSelectorDetails } from "../V1ObjectFieldSelector/details";
import { ResourceFieldSelectorDetails } from "../V1ResourceFieldSelector/details";

export const DownwardAPIVolumeFileDetails = ({ resourceData }: { resourceData: V1DownwardAPIVolumeFile }): JSX.Element => {

    // Check if component has any content to display
    const hasContent = (() => {
        const checks = [];
        // Check simple properties
        checks.push([resourceData.mode, resourceData.path].some(v => v !== undefined && v !== null));
        // Check k8s type properties
        checks.push([resourceData.fieldRef, resourceData.resourceFieldRef].some(v => v !== undefined && v !== null));
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
                    { label: "Mode", value: resourceData.mode || '-' },
                    { label: "Path", value: resourceData.path }
                ]}
                columns={1}
            />

            {resourceData.fieldRef && (
                <Container title="Field Ref">
                    <ObjectFieldSelectorDetails resourceData={ resourceData.fieldRef } />
                </Container>
            )}

            {resourceData.resourceFieldRef && (
                <Container title="Resource Field Ref">
                    <ResourceFieldSelectorDetails resourceData={ resourceData.resourceFieldRef } />
                </Container>
            )}

        </>
    )
}